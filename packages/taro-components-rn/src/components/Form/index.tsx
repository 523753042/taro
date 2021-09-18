/**
 * ✘ report-submit
 * ✔ onSubmit(bindsubmit): no FormId info.
 * ✘ onReset(bindreset)
 */

import * as React from 'react'
import { View } from 'react-native'
import { noop } from '../../utils'

import { FormProps, FormValues, FormComponentMap } from './PropsType'



function isFormTypeElement(typeName: string): boolean {
  return [
    '_Input',
    '_Textarea',
    '_CheckboxGroup',
    '_RadioGroup',
    '_Switch',
    '_Slider',
    '_Picker'
  ].indexOf(typeName) >= 0
}

class _Form extends React.Component<FormProps> {
  formValues: FormValues = {}

  /**
   * 处理受控的表单组件及初始化值
   */
  bindValueChangeEvent<T extends keyof FormComponentMap>(child: React.ReactElement<FormComponentMap[T], React.ComponentType<FormComponentMap[T]>>) {
    // onChange: _CheckboxGroup _RadioGroup _Switch _Slider _Picker
    // onBlur: _Input _Textarea
    const childTypeName = child.type && child.type.name
    const childPropsName = (child.props.name as string)
    const valueChangeCbName = ['_Input', '_Textarea'].indexOf(childTypeName) > -1 ? 'onBlur' : 'onChange'
    const tmpProps = { ...child.props }
    // Initial value
    // value: _Input', '_Textarea', '_Slider', '_Picker
    // _Switch: checked
    // value: _CheckboxGroup , _RadioGroup
    if (['_Input', '_Textarea', '_Slider', '_Picker'].indexOf(childTypeName) > -1) {
      this.formValues[childPropsName] = (child as React.ReactElement<FormComponentMap[keyof { _Input, _Textarea, _Slider, _Picker }], React.ComponentType<FormComponentMap[keyof { _Input, _Textarea, _Slider, _Picker }]>>).props.value
    } else if (childTypeName === '_Switch') {
      this.formValues[childPropsName] = !!((child as React.ReactElement<FormComponentMap['_Switch'], React.ComponentType<FormComponentMap['_Switch']>>)).props.checked
    } else {
      (tmpProps as FormComponentMap[keyof { _CheckboxGroup, _RadioGroup }])._onGroupDataInitial = (value: any) => {
        this.formValues[childPropsName] = value
      }
    }
    const self = this
    tmpProps[valueChangeCbName] = function (event: any) {
      const valueChangeCb = child.props[valueChangeCbName] || noop
      self.formValues[childPropsName] = event.detail.value
      valueChangeCb(...arguments)
    }
    // return React.cloneElement(child, tmpProps, child.props.children)
  }

  deppDiveIntoChildren = (children: React.ReactNode): React.ReactNode => {
    return React.Children.toArray(children).map((child: React.ReactElement<any, any>) => {
      const childTypeName = child.type && child.type.name
      if (!child.type) return child
      if (childTypeName === '_Button' && ['submit', 'reset'].indexOf(child.props.formType) >= 0) {
        const onClick = child.props.onClick || noop
        return React.cloneElement(child, {
          ...child.props,
          onClick: () => {
            const formType: 'submit' | 'reset' = child.props.formType
            this[formType]()
            onClick()
          }
        })
      }
      return isFormTypeElement(childTypeName) && (child.props.name as keyof FormComponentMap)
        ? this.bindValueChangeEvent<typeof child.props.name>(child)
        : React.cloneElement(child, { ...child.props }, this.deppDiveIntoChildren(child.props.children))
    })
  }

  submit = (): void => {
    const { onSubmit = noop } = this.props
    onSubmit({
      detail: {
        value: this.formValues
      }
    })
  }

  reset = (): void => {
    const { onReset = noop } = this.props
    onReset()
  }

  render(): JSX.Element {
    const {
      children,
      style,
    } = this.props

    return (
      <View style={style}>
        {this.deppDiveIntoChildren(children)}
      </View>
    )
  }
}

export default _Form
