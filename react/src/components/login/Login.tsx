import {useState} from "react";
import {useAuthData} from "../../auth/AuthWrapper.tsx";
import {useNavigate} from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuthData();
  const [ error, setError ] = useState('');

  const doLogin = async (e) => {
    e.preventDefault();

    const data = new FormData(e.target);
    try {
      await login(data.get('email'))
      navigate('/tasks');
    } catch (error) {
      setError(error);
    }
  }

  return <>
    <h2>Login</h2>
    <form onSubmitCapture={doLogin}>
      <div>
        <input name='email' />
      </div>
      {error ? <p>{error}</p> : null}
      <div>
        <button type="submit" className="btn btn-success">Submit</button>
      </div>
    </form>
  </>
}

export default Login;
