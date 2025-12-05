import { Loader } from "lucide-react";

const Button = ({ children, isLoading, ...props }: any) => {
	return (
		<button
			disabled={isLoading}
			className='w-full py-3 px-4 bg-linear-to-r from-green-500 to-emerald-600 text-white 
            font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none 
            focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 
            transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
			{...props}
		>
			{isLoading ? <Loader className='w-6 h-6 animate-spin mx-auto' /> : children}
		</button>
	);
};
export default Button;