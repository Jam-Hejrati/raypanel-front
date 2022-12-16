import ShieldLogo from "../../assets/image/Shield.png";
import styles from "../../assets/Styles/LoginForm.module.css";
import axios from "axios";
import {useEffect , useReducer , useState} from "react";

// Put IP as BASE_URL in .env file (you can see .env,example for better inf)
const BASE_URL = process.env.REACT_APP_BASE_URL

const emailReducer = (state , action) => {
  if (action.type === 'USER_INPUT') return {value: action.val , isValid: action.val.includes('@')}
  if (action.type === 'INPUT_BLUR') return {value: state.value , isValid: state.value.includes('@')}
  return {value: '' , isValid: false}
}

const passwordReducer = (state , action) => {
  if (action.type === 'USER_INPUT') return {value: action.val , isValid: action.val.trim().length > 7}
  if (action.type === 'INPUT_BLUR') return {value: state.value , isValid: state.value.trim().length > 7}
  return {value: '' , isValid: false}
}

const LoginForm = (props) => {
  const [formIsValid , setFormIsValid] = useState(false)
  const [emailState , dispatchEmail] = useReducer(emailReducer , {value: '' , isValid: null})
  const [passwordState , dispatchPassword] = useReducer(passwordReducer , {value: '' , isValid: null})

  // Destructing information's validation
  const {isValid: emailIsValid} = emailState
  const {isValid: passwordIsValid} = passwordState

  // Send request
  useEffect(() => {
    formIsValid && setData()
  } , [formIsValid])

  const setData = async () => {
    await axios.post(`${BASE_URL}/v1/auth/login` , {
      email: `${emailState.value}` ,
      password: `${passwordState.value}`
    }).then(res => {
      console.log(res)
    }).catch(err => {
      if (err) {
        console.error(err)
        setFormIsValid(false)
      }
    })
  }

  const emailChangeHandler = event => {
    dispatchEmail({
      type: 'USER_INPUT' ,
      val: event.target.value
    })
  }

  const passwordChangeHandler = event => {
    dispatchPassword({
      type: 'USER_INPUT' ,
      val: event.target.value
    })
  }

  const validateEmailHandler = () => {
    dispatchEmail({type: 'INPUT_BLUR'})
  }

  const validatePasswordHandler = () => {
    dispatchPassword({type: 'INPUT_BLUR'})
  }

  const submitHandler = event => {
    event.preventDefault()
    setFormIsValid(emailIsValid && passwordIsValid)
  }

  return (
      <>
        <section
            className={`pb-12 h-screen w-screen flex items-center justify-center flex-col ${styles.sectionBackground}`}
        >
          <img
              className="w-[128px] h-[122px]"
              src={ShieldLogo}
              alt="Shield logo"
          ></img>
          <h2 className="font-bold sm:text-lg lg:text-xl text-[#37477E]">ZAN ZENDEGI AZADI</h2>
          <form onSubmit={submitHandler} className="m-10 flex flex-col items-center justify-center gap-4">
            <input
                onChange={emailChangeHandler}
                className={`px-4 py-3 sm:w-64 md:w-80 rounded-lg outline-[#c9cdd6] ${emailState.isValid === false ? 'bg-red-200 border-red-700' : ''}`}
                placeholder="Username"
                onBlur={validateEmailHandler}
            />
            <input
                onChange={passwordChangeHandler}
                type="password"
                className={`px-4 py-3 sm:w-64 md:w-80 rounded-lg outline-[#c9cdd6] ${passwordState.isValid === false ? 'bg-red-200 border-red-700' : ''}`}
                placeholder="Password"
                onBlur={validatePasswordHandler}
            />
            <button
                type="submit"
                className="px-4 py-3 my-2 block w-[13.25rem] sm:w-64 md:w-80 rounded-lg bg-[#0066ff] hover:bg-[#0055d5] text-white text-lg font-semibold"
                // disabled={formIsValid === false}
            >
              Log in
            </button>
            <h4 className="mt-2 text-[#0066FF] font-semibold tracking-tight">
              For the freedom of Iran
            </h4>
          </form>
        </section>
      </>
  );
};

export default LoginForm;
