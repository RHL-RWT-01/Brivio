import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Mail, User, Lock } from "lucide-react";

const Signup = () => {
    const [formData, setFormData] = useState({
        email: "",
        fullName: "",
        password: "",
    });

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { mutate: signupMutation, isError, isPending, error } = useMutation({
        mutationFn: async ({ email, fullName, password }: typeof formData) => {
            try {
                const res = await fetch(`http://localhost:3000/api/auth/signup`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({ email, fullName, password }),
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to create account");
                return data;
            } catch (err: any) {
                throw new Error(err.message || "Signup failed");
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
            navigate("/");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        signupMutation(formData);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Join today.</h2>
                <form
                    className="flex flex-col gap-4"
                    onSubmit={handleSubmit}
                >
                    {/* Full Name */}
                    <div className="relative">
                        <input
                            type="text"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 text-gray-800 placeholder-gray-400"
                            placeholder="Full Name"
                            name="fullName"
                            onChange={handleInputChange}
                            value={formData.fullName}
                            required
                        />
                        <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    </div>

                    {/* Email */}
                    <div className="relative">
                        <input
                            type="email"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 text-gray-800 placeholder-gray-400"
                            placeholder="Email"
                            name="email"
                            onChange={handleInputChange}
                            value={formData.email}
                            required
                        />
                        <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <input
                            type="password"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 text-gray-800 placeholder-gray-400"
                            placeholder="Password"
                            name="password"
                            onChange={handleInputChange}
                            value={formData.password}
                            required
                        />
                        <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors duration-200"
                        disabled={isPending}
                    >
                        {isPending ? "Signing up..." : "Sign up"}
                    </button>

                    {/* Error */}
                    {isError && <p className="text-red-500 text-center text-sm mt-2">{error?.message}</p>}
                </form>

                {/* Already have account */}
                <div className="text-center mt-6 text-gray-700">
                    <p>Already have an account?</p>
                    <Link to="/login" className="text-blue-600 font-semibold hover:underline mt-1 inline-block">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;