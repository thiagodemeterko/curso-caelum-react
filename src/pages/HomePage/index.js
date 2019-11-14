import React, { Component, Fragment } from 'react';
import Cabecalho from '../../components/Cabecalho'
import NavMenu from '../../components/NavMenu'
import Dashboard from '../../components/Dashboard'
import Widget from '../../components/Widget'
import TrendsArea from '../../components/TrendsArea'
import Tweet from '../../components/Tweet'
import {Modal} from '../../components/Modal'
import Helmet from 'react-helmet'
import { TweetsService } from '../../services/TweetsService';

class HomePage extends Component {
  constructor() {
      super();
      this.state = {
          novoTweet: "",
          tweets: [],
          tweetAtivoNoModal: {}
      };
  }
  
  componentDidMount() {
    window.store.subscribe(() => {
        this.setState({
            tweets: window.store.getState()
        })
    })

    TweetsService.carrega()
        .then((tweets) => {
            window.store.dispatch({type: 'CARREGA_TWEETS', tweets})
        })
  }

  adicionaTweet = (infosDoEvento) => {
      infosDoEvento.preventDefault();
      if(this.state.novoTweet.length > 0) {
        TweetsService.adiciona(this.state.novoTweet)
        .then((tweetVindoDoServidor) => {
            console.log(tweetVindoDoServidor)
            this.setState({
                tweets: [tweetVindoDoServidor, ...this.state.tweets]
            })
        })
      }
  };

  removeTweet(idTweetQueVaiSerRemovido) {
      console.log(idTweetQueVaiSerRemovido)
      TweetsService.remove(idTweetQueVaiSerRemovido)
      .then((response) => {
          console.log(response)
          const listaDeTweetsAtualizada = this.state.tweets.filter((tweet) => tweet._id !== idTweetQueVaiSerRemovido)
          this.setState({
              tweets: listaDeTweetsAtualizada
          })
          this.fechaModal()
      })
  }

  abreModal = tweetQueVaiProModal => {
      this.setState({
          tweetAtivoNoModal: tweetQueVaiProModal
      }, () => {
          console.log(this.state.tweetAtivoNoModal);
      })
  }

  fechaModal = () => this.setState({tweetAtivoNoModal: {}})

  render() {
    return (
      <Fragment>
          <Helmet>
              <title>Twitelum - ({`${this.state.tweets.length}`})</title>
          </Helmet>
        <Cabecalho>
            <NavMenu usuario={"@omariosouto"} />
        </Cabecalho>
        <div className="container">
            <Dashboard>
                <Widget>
                    <form className="novoTweet" onSubmit={this.adicionaTweet}>
                        <div className="novoTweet__editorArea">
                            <span 
                                className={
                                    `novoTweet__status
                                    ${
                                        this.state.novoTweet.length > 140
                                        ? 'novoTweet__status--invalido'
                                        : ''
                                    }
                                    `
                                }>
                                {this.state.novoTweet.length}/140
                            </span>
                            <textarea 
                                className="novoTweet__editor" 
                                value={this.state.novoTweet}
                                onChange={ (event) => this.setState({ novoTweet: event.target.value})}
                                placeholder="O que está acontecendo?">
                            </textarea>
                        </div>
                        <button 
                            type="submit" 
                            className="novoTweet__envia"
                            disabled={this.state.novoTweet.length > 140 || this.state.novoTweet.length === 0}>Tweetar</button>
                    </form>
                </Widget>
                <Widget>
                    <TrendsArea />
                </Widget>
            </Dashboard>
            <Dashboard posicao="centro">
                <Widget>
                    <div className="tweetsArea">
                        {
                            this.state.tweets.length
                            ?
                            this.state.tweets.map((tweetInfo) => {
                                return <Tweet 
                                    key={tweetInfo._id}
                                    id={tweetInfo._id}
                                    texto={tweetInfo.conteudo}
                                    usuario={tweetInfo.usuario}
                                    likeado={tweetInfo.likeado}
                                    totalLikes={tweetInfo.totalLikes}
                                    removivel={tweetInfo.removivel}
                                    removeHandler={(event) => this.removeTweet(tweetInfo._id)}
                                    onClickNaAreaDeConteudo={() => this.abreModal(tweetInfo)}/>
                            })
                            :
                            <p>Crie seu primeiro Tweet!</p>
                        }

                    <Modal 
                        isAberto={Boolean(this.state.tweetAtivoNoModal._id)}
                        onFechando={this.fechaModal}
                    >
                        {() => (
                            <Tweet
                                id={this.state.tweetAtivoNoModal._id}
                                usuario={this.state.tweetAtivoNoModal.usuario}
                                texto={this.state.tweetAtivoNoModal.conteudo}
                                totalLikes={this.state.tweetAtivoNoModal.totalLikes}
                                removivel={this.state.tweetAtivoNoModal.removivel}
                                removeHandler={() => 
                                    this.removeTweet(this.state.tweetAtivoNoModal._id)
                                }
                                likeado={this.state.tweetAtivoNoModal.likeado}
                            />
                        )}
                    </Modal>
                    </div>
                </Widget>
            </Dashboard>
        </div>
      </Fragment>
    );
  }
}

export default HomePage;
