/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { LuCopyPlus, LuLoader } from 'react-icons/lu';
import FormInput from '../form/FormInput';
import FormTextArea from '../form/FormTextArea';
import { FaPlusSquare } from 'react-icons/fa';

interface CreateRoomProps {
    handleRefresh: () => void;
}

type Inputs = {
  name: string;
  description: string;
  //image: string;
}

const CreateRoom = ({ handleRefresh }: CreateRoomProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const { 
        register, 
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = async (formData) => {
        const { name, description } = formData;
        try {
            setIsLoading(true);
            const res = await fetch('/api/chat-room', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, description })
            });
            if (res.ok) {
                toast.success('Room created successfully');
                setSuccess('Room created successfully');
                handleRefresh();
                setTimeout(() => {
                    setSuccess(null);
                    setError(null);
                    reset();
                }, 1000);
            } else {
                const data = await res.json();
                throw new Error(data.error);
            }
        } catch (error: any) {
            toast.error(error.message);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return (
            <div className='loader-error-container'>
                <LuLoader className='animate-spin' size={80} />
            </div>
        )
    }

  return (
    <div className='form-details'>
        {success && <div className='text-green-700'>{success}</div>}
        {error && <div className='text-red-700'>{error}</div>}
        <div className='form-header'>
            <LuCopyPlus />
            <span className='font-bold text-2xl'>Create Room</span>
        </div>
        <div className='flex w-full'>
            <form onSubmit={handleSubmit(onSubmit)} className='form'>
                <FormInput id='name' name='Name' required register={register} errors={errors} />
                <FormTextArea id='description' name='Description' required register={register} errors={errors} />
                <div className='flex my-2'>
                    <div className='w-1/2 md:w-1/4'>
                        <button
                            type='submit'
                            disabled={isSubmitting}
                            className='form-button'
                        >
                            {isSubmitting ? (
                                <LuLoader className='animate-spin' />
                            ) : (
                                <FaPlusSquare />
                            )}
                            
                            <span className='text-button'>Create</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
  )
}

export default CreateRoom