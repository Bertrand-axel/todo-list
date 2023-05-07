import {useEffect, useState} from "react";
import {Navigate} from "react-router-dom";
import {useService} from "../../contexts/containerWrapper.tsx";
import AuthService from "../../services/auth.ts";
import {catchError, of} from "rxjs";
import {User} from "../../interfaces/User.ts";
import {CurrentUserProvider} from "../../services/providers/currentUserProvider.ts";

function Login() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const currentUserProvider = useService('CurrentUserProvider') as CurrentUserProvider;
  const authService = useService('AuthService') as AuthService;

  useEffect(() => {
    const subscription = currentUserProvider.user$.subscribe(setUser)
    return () => subscription.unsubscribe();
  }, [])

  const doLogin = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    authService.login(data.get('email') as string)
      .pipe(
        catchError(error => {
          const message = error.response?.data?.message;
          if (message) {
            setError(message);
          }

          return of([]);
        })
      ).subscribe();
  }

  if (user !== null) {
    return <Navigate to={'/tasks'}/>
  }

  return <>
    <h2>Login</h2>
    <form onSubmitCapture={doLogin}>
      <div>
        <input name='email'/>
      </div>
      {error ? <p>{error}</p> : null}
      <div>
        <button type="submit" className="btn btn-success">Submit</button>
      </div>
    </form>
  </>
}

export default Login;
