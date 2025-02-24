'use client'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast';
import { BsFillSendFill } from "react-icons/bs";
import { useForm, SubmitHandler } from 'react-hook-form';
import { LuLoader } from 'react-icons/lu';
interface ChatInputProps {
    chatRoomId: string | null;
}

type Inputs = {
    content: string;
}

const ChatInput = ({ chatRoomId }: ChatInputProps) => {
    const [error, setError] = useState<string | null>(null);

    const { 
        register, 
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting } 
    } = useForm<Inputs>();

    const content = watch('content');

    const onSubmit: SubmitHandler<Inputs> = async (formData) => {
        const { content } = formData;
        try {
            const response = await fetch('/api/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content, chatRoomId }),
            });
            if (!response.ok) {
                throw new Error('Failed to send message');
            }
            toast.success('Message sent successfully');
            reset();
            setError(null);
        } catch (error) {
            console.error(error);
            toast.error('Failed to send message');
            setError('Failed to send message');
        } 
    }


  return (
    <div className='chat-input'>
        <div className='main'>
            <form onSubmit={handleSubmit(onSubmit)} className='input-form'>
                <input
                    id='content' 
                    type='text' 
                    {...register('content', { required: 'Message is required' })}
                    className='input'    
                    placeholder='Message...'
                />
                <button 
                    type='submit' 
                    className={`input-button ${isSubmitting || !content || !chatRoomId ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer '}`}
                    disabled={isSubmitting || !content || !chatRoomId}
                >
                    {isSubmitting ? 
                        <LuLoader className='animate-spin' /> 
                        : <BsFillSendFill />
                    }
                    <span className='text-button lg:flex hidden'>{isSubmitting ? 'Sending...' : 'Send'}</span>
                </button>
            </form>
            {errors.content && <div className='text-red-700'>{errors.content.message}</div>}
            {error && <div className='text-red-700'>{error}</div>}
        </div>
    </div>
  )
}

export default ChatInput