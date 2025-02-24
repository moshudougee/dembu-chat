/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React from 'react'
import {  FieldErrors, FieldValues } from 'react-hook-form'

interface FormTextAreaProps<T extends FieldValues> {
    id: keyof T;
    name: string;
    required?: boolean;
    maxLength?: number;
    rows?: number;
    register: (name: keyof T, options: any) => any;
    errors: FieldErrors<T>;
}

const FormTextArea = <T extends FieldValues,>({
    id,
    name,
    maxLength,
    required,
    rows = 6,
    register,
    errors,
  }: FormTextAreaProps<T>) => {
    const errorMessage = errors[id]?.message as React.ReactNode
  return (
    <div className='flex flex-col gap-1'>
        <div className='form-item'>
            <div className='flex w-full md:w-1/5 md:h-full'>
                <span className=''>{name}</span>
            </div>
            <div className='flex w-full md:w-4/5'>
                <textarea
                    id={id}
                    rows={rows}
                    {...register(id, {
                        required: required && `${name} is required`,
                        maxLength: maxLength && `${name} must be at most ${maxLength} characters long`,
                    })}
                    className='form-input'
                />
            </div>
        </div>
        {errorMessage && <div className='text-red-700'>{errorMessage}</div>}
    </div>
  )
}

export default FormTextArea