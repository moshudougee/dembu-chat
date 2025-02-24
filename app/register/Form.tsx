/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import FormInput from '@/components/form/FormInput';
import { FaEye, FaEyeSlash, FaUserPlus } from 'react-icons/fa';
import { LuLoader, LuCopyPlus } from 'react-icons/lu';
import Link from 'next/link';
import GoogleButton from '@/components/GoogleButton';
type Inputs = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const Form = () => {
    const { data: session } = useSession()
    const [showPass, setShowPass] = useState<boolean>(false)
    const [showConfirmPass, setShowConfirmPass] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const params = useSearchParams()
    const router = useRouter()
    const callbackUrl = params.get('callbackUrl') || '/'

    const handleTogglePass = () => setShowPass(!showPass)
    const handleToggleConfirmPass = () => setShowConfirmPass(!showConfirmPass)
    
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm<Inputs>({
        defaultValues: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        },
    })

    useEffect(() => {
        if (session && session.user) {
        router.push(callbackUrl)
        }
    }, [callbackUrl, params, router, session])

    const formSubmit: SubmitHandler<Inputs> = async (form) => {
        try {
            setLoading(true)
            const { name, email, password } = form
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                name,
                email,
                password,
                }),
            })
            if (res.ok) {
                return router.push(
                `/login?callbackUrl=${callbackUrl}&success=Account has been created`
                )
            } else {
                const data = await res.json()
                throw new Error(data.error)
            }
        } catch (err: any) {
            const error =
                err.message && err.message.indexOf('E11000') === 0
                ? 'Email is duplicate'
                : err.message
            toast.error(error || 'error')
            setError(error)
        } finally {
            setLoading(false)
        }
  }

  if (loading) {
    return (
        <div className='flex items-center justify-center h-screen'>
            <LuLoader className='animate-spin' size={80} />
        </div>
    )
  }

  return (
    <div className='form-details'>
        {error && <div className='text-red-700'>{error}</div>}
        <div className='form-header'>
            <FaUserPlus />
            <span className='font-bold text-2xl'>Register</span>
        </div>
        <div className='form-container'>
            <form onSubmit={handleSubmit(formSubmit)} className='form'>
                <FormInput id='name' name='Name' required register={register} errors={errors} />
                <FormInput id='email' name='Email' required register={register} errors={errors} />
                <div className='form-item'>
                    <div className='form-item-label'>
                        <span>Password</span>
                    </div>
                    <div className='form-item-input'>
                        <input
                            type={showPass ? 'text' : 'password'}
                            id='password'
                            placeholder='Enter password'
                            {...register('password', {
                                required: 'Password is required',
                            })}
                            className='form-input'
                        />
                        <div className='absolute top-4 right-2'>
                            <span 
                                className='flex'
                                onClick={handleTogglePass}
                            >
                                {showPass ? 
                                    <FaEyeSlash size={24} />
                                    :
                                    <FaEye size={24} />
                                }
                            </span>
                        </div>
                    </div>
                </div>
                {errors.password?.message && (
                    <div className="text-red-700">{errors.password.message}</div>
                )}
                <div className='form-item'>
                    <div className='form-item-label'>
                        <span>Confirm Password</span>
                    </div>
                    <div className='form-item-input'>
                        <input
                            type={showConfirmPass ? 'text' : 'password'}
                            id='confirmPassword'
                            placeholder='Confirm password'
                            {...register('confirmPassword', {
                                required: 'Confirm Password is required',
                                validate: (value) => {
                                  const { password } = getValues()
                                  return password === value || 'Passwords should match!'
                                },
                            })}
                            className='form-input'
                        />
                        <div className='absolute top-4 right-2'>
                            <span 
                                className='flex'
                                onClick={handleToggleConfirmPass}
                            >
                                {showConfirmPass? 
                                    <FaEyeSlash size={24} /> 
                                    : 
                                    <FaEye size={24} />
                                }
                            </span>
                        </div>
                    </div>
                </div>
                {errors.confirmPassword?.message && (
                    <div className="text-red-700">{errors.confirmPassword.message}</div>
                )}
                <div className='form-button-container'>
                    <div className='form-button-item'>
                        <button
                            type='submit'
                            disabled={isSubmitting}
                            className='form-button'
                        >
                            {isSubmitting ? (
                                <LuLoader className='animate-spin' />
                            ) : (
                                <LuCopyPlus size={20} />
                            )}
                            
                            <span className='text-button'>Register</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
        <div className='flex items-center justify-center gap-2'>
            <GoogleButton currentPage='register' />
        </div>
        <hr className='border w-10/12 mt-5' />
        <div className='flex gap-2 mt-5'>
          Already have an account?{' '}
          <Link className="text-amber-800" href={`/login?callbackUrl=${callbackUrl}`}>
            Login
          </Link>
        </div>
    </div>
  )
}

export default Form