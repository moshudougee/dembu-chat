import React from 'react'
import { Metadata } from 'next'
import Form from './Form'

export const metadata: Metadata = {
    title: "Register",
    description: "Register to the app",
}

const Register = () => {
  return (
    <Form />
  )
}

export default Register