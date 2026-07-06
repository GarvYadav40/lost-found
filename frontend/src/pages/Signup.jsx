import { SignUp } from '@clerk/clerk-react';

const Signup = () => {
  return (
    <div className="flex items-center justify-center min-h-[75vh] py-12 px-4 sm:px-6 lg:px-8">
      <SignUp routing="path" path="/signup" signInUrl="/login" />
    </div>
  );
};

export default Signup;
