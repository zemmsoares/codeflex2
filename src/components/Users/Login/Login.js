import React, { Component } from 'react'
import { URL, URL_FRONT } from '../../commons/Constants';
import { areStringEqual, validateEmail, validateLength, validateStringChars, isStringEmpty } from '../../commons/Validation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            email: '',
            passwordConfirmation: '',
            isLoggingIn: true,
            isSigninUp: false,
            showErrors: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }




    handleChange(e) {
        this.setState({ [e.target.id]: e.target.value });
    }

    login() {

        const data = { username: this.state.username, password: this.state.password };

        if (isStringEmpty(data.username) || isStringEmpty(data.password)) {
            toast.error("Fill in all the fields", { autoClose: 2500 })
            return;
        }

        fetch(URL + '/api/account/login', {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json',
                "Cache-Control": "no-cache",
            })
        }).then(res => {
            if (res.status === 401 || res.status === 403) {
                console.log("ERRRROR")
                toast.error("Invalid credentials", { autoClose: 2500 })
                return;
            } else {
                return res.json();
            }
        }).then(data => {

            if (data) {
                console.log(data)
                window.location.href = '/';
                localStorage.setItem('token', data.token);
                localStorage.setItem('userData', JSON.stringify({ username: data.username }));

            }

        }).catch((e) => {
            console.log(e)
        })

    }

    validateRegistration = (data) => {
        console.log(data);
        this.setState({ showErrors: true });

        if (isStringEmpty(data.username) || isStringEmpty(data.email) || isStringEmpty(data.password) || isStringEmpty(data.passwordConfirmation)) {
            toast.error("Fill in all the fields", { autoClose: 2500 })
        } else {

            if (!validateLength(data.username, 3, 25)) {
                toast.error("Username must be between 3 and 25 characters");


            } else if (!validateStringChars(data.username)) {
                toast.error("Your username can only contain letters, numbers and _");
            }


            if (!validateEmail(data.email)) {
                toast.error("Wrong email format");
            }

            if (!areStringEqual(data.password, data.passwordConfirmation)) {
                toast.error("Passwords do not match");
            } else {
                if (!validateLength(data.password, 5, 64)) {
                    toast.error("Your password must be between 5 and 64 characters");
                }
            }


        }
    }

    register() {

        const sentData = { username: this.state.username, email: this.state.email, password: this.state.password };
        const validateData = { ...sentData, passwordConfirmation: this.state.passwordConfirmation }
        console.log(this.validateRegistration(validateData));

        fetch(URL + '/api/account/register', {
            method: 'POST',
            body: JSON.stringify(sentData),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(res => {
            if (res.status === 409 || res.status === 403) {
                toast.error("Username already in use.", 2500);
                return;
            } else {
                this.setState({
                    isLoggingIn: true,
                    isSigninUp: false
                })
                toast.success("Account created with success!", { autoClose: 2500 });
            }
        })

    }


    handleSubmit(e) {
        if (e.target.value === 'Login') {
            if (this.state.isLoggingIn) {
                this.login();
            } else if (this.state.isSigninUp) {
                this.setState({ isLoggingIn: true, isSigninUp: false });
            }
        } else if (e.target.value === 'Create account') {
            if (this.state.isSigninUp) {
                this.register();
            } else if (this.state.isLoggingIn) {
                this.setState({ isLoggingIn: false, isSigninUp: true });
            }
        }
    }

    renderLoginOrSignup() {
        if (this.state.isLoggingIn) {
            return (<div>
                {/*<input className="password" type="password" onChange={this.handleChange} placeholder="Password" required />*/}

                <label for="password" class="block mb-2 text-sm font-medium text-gray-900 pt-2">Your Password</label>
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
                    </div>
                    <input className="password" type="password" onChange={this.handleChange} placeholder="Password" required id="password" class="w-96 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block pl-10 p-2.5" />
                </div>


            </div>);
        } else if (this.state.isSigninUp) {
            return (<div>
                {/*<input key="1" id='email' className="email" type="email" onChange={this.handleChange} placeholder="Email" required />*/}

                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 pt-2">Your email</label>
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
                    </div>
                    <input key="1" id='email' className="email" type="email" onChange={this.handleChange} placeholder="Email" required class="w-96 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block pl-10 p-2.5" />
                </div>


                {/*<input key="2" id='password' className="password" type="password" onChange={this.handleChange} placeholder="Password" required />*/}


                <label for="password" class="block mb-2 text-sm font-medium text-gray-900 pt-2">Your password</label>
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
                    </div>
                    <input key="2" id='password' className="password" type="password" onChange={this.handleChange} placeholder="Password" required class="w-96 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block pl-10 p-2.5" />
                </div>



                {/*<input key="3" id='passwordConfirmation' className="passwordConfirmation" type="password" onChange={this.handleChange} placeholder="Confirm password" required />*/}

                <label for="passwordConfirmation" class="block mb-2 text-sm font-medium text-gray-900 pt-2">Confirm password</label>
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
                    </div>
                    <input key="3" id='passwordConfirmation' className="passwordConfirmation" type="password" onChange={this.handleChange} placeholder="Confirm password" required class="w-96 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block pl-10 p-2.5" />
                </div>



            </div>);
        }
    }

    render() {

        const loginOrSignup = this.renderLoginOrSignup();

        return (

            <div className="my-16">
                <div className="ml-6">
                    <h1 className='text-md font-bold text-gray-400 uppercase'>Start for free</h1>
                    <h1 className='text-3xl font-bold text-gray-700'>Login or create your Codeflex account today!</h1>
                    <form className="login-container">
                        {/*<img id="img-user" src={require('../../images/login_icon.png')} alt="User flat image" />*/}
                        <div>
                            <h4 className='my-8'>Account Details</h4>
                            {/*<input key="0" className="username" type="text" onChange={this.handleChange} placeholder="Username" required />*/}



                            <label for="username" class="block mb-2 text-sm font-medium text-gray-900">Your username</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
                                </div>
                                <input key="0" className="username" type="text" id="username" class="w-96 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5" onChange={this.handleChange} placeholder="Username" required />
                            </div>



                        </div>

                        {loginOrSignup}


                        <ToastContainer
                            position="top-right"
                            autoClose={5500}
                            hideProgressBar={false}
                            closeOnClick
                            rtl={false}
                            pauseOnVisibilityChange
                            draggable
                            pauseOnHover
                            style={{ fontFamily: "'Roboto', sans-serif", fontSize: '12pt', letterSpacing: '1px' }}
                        />



                        <div className="my-8">
                            <input type="button" className="w-40 text-white bg-gray-500 hover:bg-blue-800 focus:outline-none font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:hover:bg-blue-700 " value="Login" onClick={this.handleSubmit} />
                            <input type="button" className="w-40 text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:hover:bg-blue-700" value="Create account" onClick={this.handleSubmit} />
                        </div>
                    </form>
                </div>

            </div>
        );
    }
}

export default Login;