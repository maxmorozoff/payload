'use client'
import React from 'react'

import { fieldBaseClass } from '../../shared'
import { useFormFields } from '../../../Form/context'

import './index.scss'

export const TextInputWrapper: React.FC<{
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  width?: string
  path?: string
  readOnly?: boolean
}> = (props) => {
  const { children, className, style, width, path, readOnly } = props

  const field = useFormFields(([fields]) => fields[path])

  const { valid } = field || {}

  return (
    <div
      className={[fieldBaseClass, 'text', className, !valid && 'error', readOnly && 'read-only']
        .filter(Boolean)
        .join(' ')}
      style={{
        ...style,
        width,
      }}
    >
      {children}
    </div>
  )
}