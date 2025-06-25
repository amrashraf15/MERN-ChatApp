import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore.js';
import { Eye, EyeOff, Loader, Lock, Mail } from 'lucide-react';
import Input from '../components/Input.jsx';
import { Link } from 'react-router-dom';

const LoginPage = () => {
	const { login, isLoggingIn } = useAuthStore();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			await login(email, password);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="min-h-screen flex my-5 items-center justify-center bg-base-200 text-base-content">
			<div className="max-w-md w-full bg-base-100 rounded-2xl shadow-xl overflow-hidden">
				<div className="p-8">
					<h2 className="text-3xl font-bold mb-6 text-center">Welcome Back</h2>
					<form onSubmit={handleLogin} className="space-y-4">
						<Input
							icon={Mail}
							type="email"
							placeholder="Email Address"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<div className="relative">
							<Input
								icon={Lock}
								type={showPassword ? 'text' : 'password'}
								placeholder="Password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<button
								type="button"
								className="absolute inset-y-0 right-3 flex items-center focus:outline-none"
								onClick={() => setShowPassword(!showPassword)}
							>
								{showPassword ? (
									<EyeOff className="size-5 text-base-content/40" />
								) : (
									<Eye className="size-5 text-base-content/40" />
								)}
							</button>
						</div>

						<button
							type="submit"
							disabled={isLoggingIn}
							className={`btn w-full font-bold transition duration-200 ${
								isLoggingIn
									? 'btn-disabled'
									: 'btn-primary hover:brightness-110'
							}`}
						>
							{isLoggingIn ? (
								<Loader className="animate-spin mx-auto" size={24} />
							) : (
								'Login'
							)}
						</button>
					</form>
				</div>
				<div className="px-8 py-4 bg-base-200 text-sm flex justify-center">
					<p>
						Don't have an account?{' '}
						<Link to="/signup" className="text-primary hover:underline">
							Sign Up
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
