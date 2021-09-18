import { PickerDateProps, PickerMultiSelectorProps, PickerSelectorProps, PickerTimeProps, PickerRegionProps } from '@tarojs/components/types/Picker'

export interface BaseState<T> {
  /** 表示当前选中的值 */
  value: T;
  /** 表示上一次选中的值 */
  pValue: T;
}


export interface SelectorProps extends Partial<PickerSelectorProps> { }

export interface SelectorState extends BaseState<number | string> {
  pRange: any[] | undefined;
  range: any[];
}

export interface TimeProps extends Partial<PickerTimeProps> { }
export interface TimeState extends BaseState<string|Date> { }

export interface DateProps extends Partial<PickerDateProps> { }
export interface DateState extends BaseState<string | Date> { }


export interface RegionProps extends Partial<PickerRegionProps> {
  customItem?: string;
  regionData?: RegionObj[];
}
export interface RegionState extends BaseState<string[]> { }
export interface RegionObj {
  value: string
  code: string
  postcode?: string
  children?: RegionObj[]
}


export interface MultiSelectorProps extends Partial<PickerMultiSelectorProps> {
  value: number[]
}
export interface MultiSelectorState extends BaseState<any[]> {
  cols: number;
  pRange: any[];
  range: any[];
}


