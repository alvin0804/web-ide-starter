import { classNames } from "mo/common/className";
import { useRef, useState } from "react";
import { ActionBar, IActionBarItemProps } from "../actionBar";
import {
  defaultSearchInputClassName,
  searchInputToolBarClassName,
  validationBaseSearchInputClassName,
  validationErrorSearchInputClassName,
  validationInfoSearchInputClassName,
  validationWarningSearchInputClassName
} from "./base";

export interface ISearchInputProps {
  value?: string;
  className?: string;
  placeholder?: string;
  toolbarData?: IActionBarItemProps[];
  info?: { type: InfoTypeEnum; text: string };
  onChange?: (value: string) => void;
  onToolbarClick?: (addon) => void;
}

export enum InfoTypeEnums {
  info = 'info',
  warning = 'warning',
  error = 'error',
}
export type InfoTypeEnum = keyof typeof InfoTypeEnums;

export default function SearchInput(props: ISearchInputProps) {
  const { className, placeholder, toolbarData = [], onChange, value, info } = props;

  const [focusStatus, setFocus] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const onToolbarClick = (e, item) => {
    // 聚焦输入框
    textareaRef.current?.focus();
    props.onToolbarClick?.(item);
  }

  const getInfoClassName = (classname: string) => {
    switch (classname) {
      case InfoTypeEnums.info:
        return validationInfoSearchInputClassName;
      case InfoTypeEnums.warning:
        return validationWarningSearchInputClassName;
      case InfoTypeEnums.error:
        return validationErrorSearchInputClassName;
      default:
        return '';
    }
  }

  const handleInputFocus = () => {
    setFocus(true);
  }
  const handleInputBlur = () => {
    setFocus(false);
  }
  const handleInputChange = (e) => {
    if (textareaRef.current) {
      const lineHeight = 24;
      const maxLines = 5;
      // base height
      textareaRef.current.style.height = `${lineHeight}px`;
      const currentScrollerHeight = textareaRef.current.scrollHeight;
      // count the lines
      const lines = currentScrollerHeight / 24;
      if (lines > maxLines) {
        textareaRef.current.style.height = `${24 * maxLines}px`;
      } else {
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }
    onChange?.(e.target.value || '');
  }

  const handleInputKeyPress = (e) => {
    if (e.keyCode === 13) {
      onChange?.(e.target.value || '');
      e.preventDefault();
    }
  }

  return (
    <div className={classNames(defaultSearchInputClassName, className)}>
      <textarea
        ref={textareaRef}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        className={classNames(
          info?.text && getInfoClassName(info?.type || '')
        )}
        value={value || ''}
        placeholder={placeholder}
        title={placeholder}
        onKeyDown={handleInputKeyPress}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onChange={handleInputChange}
      />
      {info?.text && focusStatus && (
        <div
          className={classNames(
            validationBaseSearchInputClassName,
            getInfoClassName(info.type)
          )}
        >
          {info.text}
        </div>
      )}
      <ActionBar
        className={searchInputToolBarClassName}
        data={toolbarData}
        onClick={onToolbarClick}
      />
    </div>
  )
}