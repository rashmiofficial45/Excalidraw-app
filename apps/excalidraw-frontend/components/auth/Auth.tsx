'use client';
import React from 'react'

import { useState } from 'react';
import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Separator } from '@repo/ui/components/ui/separator';
import { Github, Mail } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
const BACKEND_URL = "http://localhost:3001";

const Auth = ({ isSignupPage }: { isSignupPage: boolean }) => { //destructuring props
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        //do something with the form data
        e.preventDefault();
        const formdata = {
            email,
            password,
            username
        }
        console.log(formdata)
        //send the form data to the server
        try {
            if (isSignupPage) {
                const response = await axios.post(`${BACKEND_URL}/signup`, {
                    name: username,
                    username: email,
                    password
                })
                if (response) {
                    console.log("User Created Successfully")
                }
                router.push("/signin")
            } else {
                const response = await axios.post(`${BACKEND_URL}/signin`, {
                    username:email,
                    password
                })
                const token = response.data
                localStorage.setItem("token", token)
                console.log(token , "Signed in Successfully")
                router.push("/");

            }
        } catch (error:any) {
            console.error("Auth error:", error.response?.data || error.message);
        }
    }
    return (
        <div>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-2 text-center">
                        <CardTitle className="text-3xl font-bold">Welcome back</CardTitle>
                        <CardDescription>
                            Sign in to your account to continue
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <Button variant="outline" className="w-full">
                                    <Github className="mr-2 h-4 w-4" />
                                    Github
                                </Button>
                                <Button variant="outline" className="w-full">
                                    <Mail className="mr-2 h-4 w-4" />
                                    Google
                                </Button>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <Separator />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">
                                        Or continue with
                                    </span>
                                </div>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {isSignupPage ? <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        type="text"
                                        placeholder="John doe"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div> : <></>}
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                {isSignupPage ?
                                    <Button type="submit" className="w-full">
                                        Sign Up
                                    </Button>
                                    :
                                    <Button type="submit" className="w-full">
                                        Sign in
                                    </Button>}
                            </form>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2">
                        <div className="text-sm text-muted-foreground text-center">
                            <Link href="/forgot-password" className="hover:text-primary underline underline-offset-4">
                                Forgot your password?
                            </Link>
                        </div>
                        {isSignupPage ?
                            <div className="text-sm text-muted-foreground text-center">
                                <Link href="/signin" className="hover:text-primary underline underline-offset-4">
                                    Sign In
                                </Link>
                            </div>
                            : <div className="text-sm text-muted-foreground text-center">
                                Don&apos;t have an account?{' '}
                                <Link href="/signup" className="hover:text-primary underline underline-offset-4">
                                    Sign up
                                </Link>
                            </div>}
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

export default Auth