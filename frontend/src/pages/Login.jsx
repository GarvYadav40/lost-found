import { SignIn } from '@clerk/clerk-react';

const Login = () => {
  return (
    <div className="flex items-center justify-center min-h-[75vh] py-12 px-4 sm:px-6 lg:px-8">
      <SignIn routing="path" path="/login" signUpUrl="/signup" />
    </div>
  );
};

export default Login;
