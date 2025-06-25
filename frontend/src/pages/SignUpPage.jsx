import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore.js';
import toast from 'react-hot-toast';
import Input from '../components/Input.jsx';
import { Eye, EyeOff, Loader, Lock, Mail, User } from 'lucide-react';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter.jsx';
import { Link } from 'react-router-dom';

const SignUpPage = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		fullName: '',
		email: '',
		password: '',
	});

	const { signup, isSigningUp } = useAuthStore();

	const validateForm = () => {
		if (!formData.fullName.trim()) return toast.error('Full Name is required');
		if (!formData.email.trim()) return toast.error('Email is required');
		if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error('Invalid email format');
		if (!formData.password) return toast.error('Password is required');
		if (formData.password.length < 6) return toast.error('Password must be at least 6 characters');
		return true;
	};

	const handleSignUp = async (e) => {
		e.preventDefault();
		const success = validateForm();
		if (success === true) signup(formData);
	};

	return (
		<div className="min-h-screen flex pt-20 items-center justify-center bg-base-200 text-base-content">
			<div className="max-w-md w-full bg-base-100 rounded-2xl shadow-xl overflow-hidden">
				<div className="p-8">
					<h2 className="text-3xl font-bold mb-6 text-center">Create Account</h2>
					<p className="text-base-content/60 mb-4 text-center">Get started with your free account</p>

					<form onSubmit={handleSignUp} className="space-y-4 relative">
						<Input
							icon={User}
							type="text"
							placeholder="Full Name"
							value={formData.fullName}
							onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
						/>
						<Input
							icon={Mail}
							type="text"
							placeholder="Email"
							value={formData.email}
							onChange={(e) => setFormData({ ...formData, email: e.target.value })}
						/>
						<div className="relative">
							<Input
								icon={Lock}
								type={showPassword ? 'text' : 'password'}
								placeholder="Password"
								value={formData.password}
								onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

						<PasswordStrengthMeter password={formData.password} />

						<button
							type="submit"
							disabled={isSigningUp}
							className={`btn w-full font-bold transition duration-200 ${
								isSigningUp
									? 'btn-disabled'
									: 'btn-primary hover:brightness-110'
							}`}
						>
							{isSigningUp ? (
								<Loader className="animate-spin mx-auto" size={24} />
							) : (
								'Sign Up'
							)}
						</button>
					</form>
				</div>
				<div className="px-8 py-4 bg-base-200 text-sm flex justify-center">
					<p>
						Already have an account?{' '}
						<Link to="/login" className="text-primary hover:underline">
							Login
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default SignUpPage;
