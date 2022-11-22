import styles from './styles.module.scss'
import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> { }

interface textAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> { }

export function Input({ ...rest }: InputProps) {
    return (
        <input className={styles.input}{...rest} />
    )
}

export function TextArea({ ...rest }: textAreaProps) {
    return (
        <textarea className={styles.input}{...rest}></textarea>
    )
}