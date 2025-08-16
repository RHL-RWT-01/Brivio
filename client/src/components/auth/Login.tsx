import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Mail, Lock, User } from "lucide-react";
const Login = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
    });

    const queryClient = useQueryClient();

    const {
        mutate: loginMutation,
        isPending,
        isError,
        error,
    } = useMutation({
        mutationFn: async ({ email, password, fullName }: { email: string; password: string; fullName: string }) => {
            try {
                const res = await fetch(`http://localhost:3000/api/auth/login`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ fullName, email, password }),
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong");
                }
            } catch (err: any) {
                throw new Error(err.message || "Login failed");
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        loginMutation(formData);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    return (
        <div className="max-w-screen-xl mx-auto flex h-screen bg-gray-50">
            <div className="flex-1 flex flex-col justify-center items-center">
                <form
                    className="flex gap-4 flex-col w-full max-w-sm"
                    onSubmit={handleSubmit}
                >
                    {/* Full Name */}
                    <label className="input input-bordered rounded flex items-center gap-2 bg-white border-gray-300">
                        <User className="w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            className="grow bg-transparent outline-none text-gray-800 placeholder-gray-400"
                            placeholder="Full Name"
                            name="fullName"
                            onChange={handleInputChange}
                            value={formData.fullName}
                            required
                        />
                    </label>

                    {/* Email */}
                    <label className="input input-bordered rounded flex items-center gap-2 bg-white border-gray-300">
                        <Mail className="w-5 h-5 text-gray-500" />
                        <input
                            type="email"
                            className="grow bg-transparent outline-none text-gray-800 placeholder-gray-400"
                            placeholder="Email"
                            name="email"
                            onChange={handleInputChange}
                            value={formData.email}
                            required
                        />
                    </label>

                    {/* Password */}
                    <label className="input input-bordered rounded flex items-center gap-2 bg-white border-gray-300">
                        <Lock className="w-5 h-5 text-gray-500" />
                        <input
                            type="password"
                            className="grow bg-transparent outline-none text-gray-800 placeholder-gray-400"
                            placeholder="Password"
                            name="password"
                            onChange={handleInputChange}
                            value={formData.password}
                            required
                        />
                    </label>

                    {/* Submit Button */}
                    <button className="btn rounded-full btn-primary text-white hover:opacity-90">
                        {isPending ? "Loading..." : "Login"}
                    </button>

                    {/* Error Message */}
                    {isError && <p className="text-red-500">{error?.message}</p>}
                </form>

                {/* Sign Up Link */}
                <div className="flex flex-col gap-2 mt-4 text-gray-700">
                    <p className="text-lg">{"Don't"} have an account?</p>
                    <Link to="/signup">
                        <button className="btn rounded-full btn-outline border-gray-400 text-gray-700 hover:bg-gray-100 w-full">
                            Sign up
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;