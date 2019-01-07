import React, {Component} from 'react';
import {Button, Col, Form, Icon, Input, Layout, Row} from 'antd';
import axios from 'axios';
import {isNil} from 'ramda';
import 'antd/dist/antd.css';
import logo from './logo.svg';
import './App.css';

const {Header, Content, Footer} = Layout;
const FormItem = Form.Item;

const apiGateway = `http://${window.location.hostname}:3002`;
// const apiGateway = `http://api-gateway:80`;
// const apiGateway = `http://192.168.99.100:3002/authenticate`;

class App extends Component {
  state = {
    jwt: null,
    successfulLogin: null
  };

  authenticate = values => {
    axios.post(`${apiGateway}/authenticate`, {
      values
    })
      .then(response => {
        const jwt = response.data.message.token;

        this.setState({jwt: jwt, successfulLogin: true})
      })
      .catch(() => {
        this.setState({jwt: null, successfulLogin: false})
      })
  };

  onClick = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.authenticate(values)
      }
    });
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    const successfulLogin = this.state.successfulLogin;
    const bottomComponent = isNil(successfulLogin) ? '' :
      successfulLogin ?
        <div className="success-container">
          <div className="success-label"> Great success! Here is your token:</div>
          <div className="success-token"> {this.state.jwt} </div>
        </div> :
        <div className="error-label"> FUCK OFF, it is a closed party! </div>;

    return (
      <Layout className="App">
        <Header className="App-header">
          <img src={logo}
               className="App-logo"
               alt="logo"/>
          <h1 className="App-title">Authenticate yourself</h1>
          <img src={logo}
               className="App-logo"
               alt="logo"/>
        </Header>
        <Content className="page-content">
          <div className="page-container">
            <Row style={{height: '100%', overflow: 'auto'}}
                 className="login-form-container">
              <div className="the-form">
                <Col span={24}>
                  <Form className="login-form">
                    <FormItem>
                      {getFieldDecorator('userName', {
                        rules: [{required: true, message: 'Please input your username!'}],
                      })(
                        <Input prefix={<Icon type="user"
                                             style={{color: 'rgba(0,0,0,.25)'}}/>}
                               placeholder="Username"/>
                      )}
                    </FormItem>
                    <FormItem>
                      {getFieldDecorator('password', {
                        rules: [{required: true, message: 'Please input your Password!'}],
                      })(
                        <Input prefix={<Icon type="lock"
                                             style={{color: 'rgba(0,0,0,.25)'}}/>}
                               type="password"
                               placeholder="Password"/>
                      )}
                    </FormItem>
                    <FormItem className="login-button-form-item">
                      <Button type="primary"
                              className="login-button"
                              onClick={this.onClick}>
                        Log the fuck in
                      </Button>
                    </FormItem>
                  </Form>
                </Col>
              </div>
            </Row>
            <Row style={{height: '100%', overflow: 'auto'}}
                 className="output">
              {bottomComponent}
            </Row>
          </div>
        </Content>
        <Footer>

        </Footer>
      </Layout>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(App);

export default WrappedNormalLoginForm;
