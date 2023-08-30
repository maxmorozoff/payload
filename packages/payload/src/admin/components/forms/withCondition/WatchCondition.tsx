import type React from 'react'

import { useEffect } from 'react'

import type { Condition } from '../../../../fields/config/types.js'

import { useAuth } from '../../utilities/Auth/index.js'
import { useDocumentInfo } from '../../utilities/DocumentInfo/index.js'
import { useAllFormFields } from '../Form/context.js'
import getSiblingData from '../Form/getSiblingData.js'
import reduceFieldsToValues from '../Form/reduceFieldsToValues.js'

type Props = {
  condition: Condition
  name: string
  path?: string
  setShowField: (isVisible: boolean) => void
}

export const WatchCondition: React.FC<Props> = ({
  condition,
  name,
  path: pathFromProps,
  setShowField,
}) => {
  const path = typeof pathFromProps === 'string' ? pathFromProps : name

  const { user } = useAuth()
  const [fields, dispatchFields] = useAllFormFields()
  const { id } = useDocumentInfo()

  const data = reduceFieldsToValues(fields, true)
  const siblingData = getSiblingData(fields, path)

  // Manually provide ID to `data`
  data.id = id

  const hasCondition = Boolean(condition)
  const isPassingCondition = hasCondition ? condition(data, siblingData, { user }) : true
  const field = fields[path]

  const wasPassingCondition = field?.passesCondition

  useEffect(() => {
    if (hasCondition) {
      if (isPassingCondition && !wasPassingCondition) {
        dispatchFields({ path, result: true, type: 'MODIFY_CONDITION', user })
      }

      if (
        !isPassingCondition &&
        (wasPassingCondition || typeof wasPassingCondition === 'undefined')
      ) {
        dispatchFields({ path, result: false, type: 'MODIFY_CONDITION', user })
      }
    }
  }, [
    isPassingCondition,
    wasPassingCondition,
    dispatchFields,
    path,
    hasCondition,
    user,
    setShowField,
  ])

  useEffect(() => {
    setShowField(isPassingCondition)
  }, [setShowField, isPassingCondition])

  return null
}