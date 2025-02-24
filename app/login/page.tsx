import React from 'react'
import { Metadata } from 'next'
import Form from './Form'

export const metadata: Metadata = {
    title: "Login",
    description: "Login to the app",
}

const Login = () => {
  return (
    <Form />
  )
}

export default Login