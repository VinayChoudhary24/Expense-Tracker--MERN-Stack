import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAppDispatch } from '../../hooks/useAuth';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { setUser } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config/app';
import axios from 'axios';
import { FirebaseError } from 'firebase/app';
import { toast } from 'react-toastify';
// import axios from 'axios'; // Uncomment if you are using axios for saving user data

const handleFirebaseAuthError = (error: FirebaseError): string => {
  let errorMessage = 'An unknown error occurred!';
  
  if (!error.message) {
    return errorMessage;
  }

  console.log("firebase-err-msg", error.message)
  switch (error.message) {
    case 'Firebase: The email address is already in use by another account. (auth/email-already-in-use).':
      errorMessage = 'This email is already registered. Please login instead.';
      break;
    case 'Firebase: Error (auth/invalid-password).':
      errorMessage = 'The password is invalid. Please try again.';
      break;
    case 'Firebase: Error (auth/user-not-found).':
      errorMessage = 'No account found with this email. Please sign up first.';
      break;
    default:
      errorMessage = error.message;
  }

  return errorMessage;
};

interface SignupFormInputs {
  email: string;
  password: string;
}

const Signup: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormInputs>();

  const onSubmit: SubmitHandler<SignupFormInputs> = async ({ email, password }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user) {
        const token = await user.getIdToken();
        const userData = { email: user.email };
        localStorage.setItem('token', token);
        // localStorage.setItem('user', JSON.stringify(userData));
        dispatch(setUser(userData.email));
        let payload = {
          email, 
          password
        }
        navigate('/home');
        // Save the user to DB and handle the response
        const response: any = await axios.post(`${API_BASE_URL}/user/register`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response?.data?.success === 1) {
          // If the registration is successful, store the user's _id in localStorage
          const userId = response?.data?.response?._id;
          let user = {
            email,
            userId
          }
          // localStorage.setItem('_id', userId);
          localStorage.setItem('user', JSON.stringify(user));
          toast.success(response?.data?.message || "User registered");
        }
      }
    } catch (error: any) {
      console.error('Signup error', error);
      const firebaseErrorMessage = handleFirebaseAuthError(error);
      setErrorMessage(firebaseErrorMessage);
      setTimeout(() => {
        setErrorMessage(null);
      }, 2000);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h2 className="text-xl font-bold mb-4">Signup</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-2">
          <input
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Invalid email address',
              },
            })}
            placeholder="Email"
            className="p-2 border rounded w-full"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>
        <div className="mb-4">
          <input
            type="password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
            placeholder="Password"
            className="p-2 border rounded w-full"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>
        {errorMessage && (
          <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
        )}
        <button type="submit" className="text-white p-2 rounded w-full" style={{ backgroundColor: '#005FE4' }}>
          Signup
        </button>
      </form>
      <p className="mt-4 text-center text-gray-600">
        Already have an account?{' '}
        <span onClick={() => navigate('/login')} className="text-blue-500 cursor-pointer">
          Login here
        </span>
      </p>
    </div>
  );
};

export default Signup;