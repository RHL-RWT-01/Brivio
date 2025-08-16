import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Mail, User, Lock } from "lucide-react";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Signup = () => {
    const [formData, setFormData] = useState({
        email: "",
        fullName: "",
        password: "",
    });

    const queryClient = useQueryClient();

    const { mutate, isError, isPending, error } = useMutation({
        mutationFn: async ({ email, fullName, password }: typeof formData) => {
            try {
                const res = await fetch(`${BASE_URL}/api/auth/signup`, {
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
            } catch (err) {
                console.error(err);
                throw err;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutate(formData);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="max-w-screen-xl mx-auto flex h-screen px-10 bg-gray-50">
            <div className="flex-1 flex flex-col justify-center items-center">
                <form
                    className="lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col"
                    onSubmit={handleSubmit}
                >
                    {/* Heading */}
                    <h1 className="text-4xl font-extrabold text-gray-800">Join today.</h1>

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

                    {/* Submit */}
                    <button className="btn rounded-full btn-primary text-white hover:opacity-90">
                        {isPending ? "Loading..." : "Sign up"}
                    </button>

                    {/* Error */}
                    {isError && <p className="text-red-500">{error?.message}</p>}
                </form>

                {/* Already have account */}
                <div className="flex flex-col lg:w-2/3 gap-2 mt-4 text-gray-700">
                    <p className="text-lg">Already have an account?</p>
                    <Link to="/login">
                        <button className="btn rounded-full btn-outline border-gray-400 text-gray-700 hover:bg-gray-100 w-full">
                            Sign in
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
