import React, { Component, Fragment } from 'react'
import Cabecalho from '../../components/Cabecalho'
import Widget from '../../components/Widget'
import {NotificacaoContext} from '../../contexts/NotificacaoContext';
import {LoginService} from '../../services/LoginService';
import {InputFormField} from '../../components/InputFormField';
import './loginPage.css'

class LoginPage extends Component {

    constructor() {
        super();
        this.state = {
            values: {   
                inputLogin: "",
                inputSenha: ""
            },
            errors: {},
            erro: ""
        };
    }

    formValidations = () => {
        const {inputLogin, inputSenha} = this.state.values;
        const errors = {};
        
        if(!inputLogin) errors.inputLogin = "Campo Login é obrigatório";

        if(!inputSenha) errors.inputSenha = "Campo Senha é obrigatório";

        this.setState({errors});
    }

    onFormFieldChange = ({target}) => {
        const value = target.value;
        const name = target.name;
        const values = {...this.state.values, [name]: value};
        this.setState({values}, () => {
            this.formValidations();
        })
    }

    static contextType = NotificacaoContext;

    fazerLogin = infosDoEvento => {
        infosDoEvento.preventDefault();

        const dadosDeLogin = {
            login: this.state.values.inputLogin,
            senha: this.state.values.inputSenha
        };

        LoginService.logar(dadosDeLogin)
        .then(() => { 
            this.context.setMsg("Bem vindo ao Twitelum, login foi efetuado com sucesso!");
            this.props.history.push("/");
        })
        .catch(err => {
            console.error(`[Erro ${err.status}]`, err.message);

            this.setState({
                erro: err.message
            }, () => 
                setTimeout(() => this.setState({
                    erro: ""
                }), 1500)
            )
        });
    }

    render() {
        return (
            <Fragment>
                <Cabecalho />
                <div className="loginPage">
                    <div className="container">
                        <Widget>
                            <h2 className="loginPage__title">Seja bem vindo!</h2>
                            <form className="loginPage__form" action="/" onSubmit={this.fazerLogin}>
                                <InputFormField
                                    id="inputLogin"
                                    label="Login: "
                                    onChange={this.onFormFieldChange}
                                    values={this.state.values}
                                    errors={this.state.errors}
                                />
                                <InputFormField
                                    id="inputSenha"
                                    label="Senha: "
                                    onChange={this.onFormFieldChange}
                                    values={this.state.values}
                                    errors={this.state.errors}
                                />
                                
                                {
                                    this.state.erro 
                                    &&
                                    <div className="loginPage__errorBox">
                                        {this.state.erro}
                                    </div>
                                }
                                <div className="loginPage__inputWrap">
                                    <button className="loginPage__btnLogin" type="submit">
                                        Logar
                                    </button>
                                </div>
                            </form>
                        </Widget>
                    </div>
                </div>
            </Fragment>
        )
    }
}


export default LoginPage