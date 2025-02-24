'use client'
import FormInput from '@/components/form/FormInput';
import GoogleButton from '@/components/GoogleButton';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaEyeSlash } from 'react-icons/fa';
import { FaEye } from 'react-icons/fa';
import { LuLoader, LuLogIn } from 'react-icons/lu';
import { SiTicktick } from 'react-icons/si';

type Inputs = {
    email: string;
    password: string;
 }

const Form = () => {
    const { data: session } = useSession()
    const [showPass, setShowPass] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    
    const params = useSearchParams()
    const router = useRouter()
    const callbackUrl = params.get('callbackUrl') || '/'

    const handleTogglePass = () => setShowPass(!showPass)
    
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<Inputs>({
        defaultValues: {
        email: '',
        password: '',
        },
    })

    useEffect(() => {
        if (session && session.user) {
        router.push(callbackUrl)
        }
    }, [callbackUrl, params, router, session])

    //console.log('session', session)

    const formSubmit: SubmitHandler<Inputs> = async (form) => {
        try {
            setLoading(true)
            const { email, password } = form
            const res = await signIn('credentials', {
            email,
            password,
            redirect: false,
            })
            if (res?.error) {
                setError('Invalid email or password')
            }
            console.log('res', res)
        } catch (error) {
            console.log('error', error)
            setError('Invalid email or password')
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
            <LuLogIn />
            <span className='font-bold text-2xl'>Login</span>
        </div>
        <div className='form-container'>
            <form onSubmit={handleSubmit(formSubmit)} className='form'>
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
                                <SiTicktick size={20} />
                            )}
                            
                            <span className='text-button'>Login</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
        <div className='flex items-center justify-center gap-2'>
            <GoogleButton currentPage='login' />
        </div>
        <hr className='border w-10/12 mt-5' />
        <div className='flex gap-2 mt-5'>
          <span>Don&rsquo;t have an account?</span>{' '}
          <Link className="text-amber-800" href={`/register?callbackUrl=${callbackUrl}`}>
            Register
          </Link>
        </div>
    </div>
  )
}

export default Form