import { useState, useContext } from 'react';
import {AuthContext} from '../AuthContext';

export const CreateUserPage = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);
  const authContext = useContext(AuthContext);

  function handleSubmit (e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (password && password.length < 6) {
      setMessage('Password should be at least 6 characters long.');
      return;
    }


    if (authContext && email && password) {
      authContext.createAccount(email, password).then((res: any) => {
        setMessage('Account created successfully.');
      })
      .catch((error) => {
        console.log(error);
        setMessage('Error occured when creating an account.');
      })
      ;
    }
  }

  return (
    <main className='max-w-xl mx-auto'>
      <h1>Create account</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='email'>Email</label>
          <input type='email' id='email' value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label htmlFor='pass'>Password</label>
          <input type='password' id='pass' value={password} onChange={(e) => setPassword(e.target.value)}/>
        </div>

        {message ? <p>{message}</p> : <></>}

        <input type='submit' value='Create account' />
      </form>
    </main>
  );
};