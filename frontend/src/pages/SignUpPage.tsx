import { motion } from "framer-motion";
import { Mail, User, Lock, Loader } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/input";
import Button from "../components/button";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../store/auth";

const SignUpPage = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	
	const navigate = useNavigate();

	// Grab functions and state from our global store
	const { signup, error, isLoading } = useAuthStore();

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			await signup(email, password, name);
			// If signup is successful, take them to verification page
			navigate("/verify-email");
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
		>
			<div className='p-8'>
				<h2 className='text-3xl font-bold mb-6 text-center bg-linear-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
					Create Account
				</h2>

				<form onSubmit={handleSignUp}>
					<Input
						icon={User}
						type='text'
						placeholder='Full Name'
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<Input
						icon={Mail}
						type='email'
						placeholder='Email Address'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<Input
						icon={Lock}
						type='password'
						placeholder='Password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>

					{/* Show error message if it exists */}
					{error && <p className='text-red-500 font-semibold mt-2'>{error}</p>}

					{/* Password strength visualizer */}
					<PasswordStrengthMeter password={password} />

					<div className='mt-5'>
						<Button isLoading={isLoading}>Sign Up</Button>
					</div>
				</form>
			</div>
			<div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
				<p className='text-sm text-gray-400'>
					Already have an account?{" "}
					<Link to={"/login"} className='text-green-400 hover:underline'>
						Login
					</Link>
				</p>
			</div>
		</motion.div>
	);
};
export default SignUpPage;