import React from 'react';
import { useState } from 'react';
import { IActionBarItemProps } from '../actionBar';
import Input, { InfoTypeEnum, InfoTypeEnums } from './input';
import { classNames } from 'mo/common/className';
import {
    baseInputClassName,
    defaultSearchClassName,
    searchTargetContainerClassName,
} from './base';

export type SearchValue = string | undefined;

export interface ISearchProps extends React.ComponentProps<any> {
    style?: React.CSSProperties;
    className?: string;
    values?: SearchValue;
    placeholder?: string;
    addon?: IActionBarItemProps[] | undefined;
    validationInfo?: string | { type: InfoTypeEnum; text: string };
    onAddonClick?: (addon) => void;
    onButtonClick?: (status: boolean) => void;
    /**
     * onChange only oberseves the values of inputs
     *
     * first value is from query input
     *
     * second value is from replace input
     */
    onChange?: (value?: SearchValue) => void;
    /**
     * onSearch always be triggered behind onChange or onClick
     */
    onSearch?: (value?: SearchValue) => void;
}

export function Search(props: ISearchProps) {
    const {
        className = '',
        style,
        placeholder = '',
        validationInfo: rawInfo,
        addo: searchAddons,
        value: searchVal,
        onAddonClick,
        onButtonClick,
        onChange,
        onSearch,
    } = props;

    const searchPlaceholder = placeholder || 'Search';

    const [isShowReplace, setShowReplace] = useState(false);

    const onToggleReplaceBtn = () => {
        setShowReplace(!isShowReplace);
        onButtonClick?.(!isShowReplace);
        onSearch?.(searchVal);
    };

    const handleSearchChange = (value: string) => {
        if (onChange) {
            onChange(value);
            onSearch?.(value);
        }
    };

    const handleToolbarClick = (addon) => {
        onAddonClick?.(addon);
        onSearch?.(searchVal);
    };

    const getInfoFromRaw = () => {
        if (rawInfo) {
            if (typeof rawInfo === 'string') {
                return { type: InfoTypeEnums.info, text: rawInfo };
            }
            return rawInfo;
        }
        return undefined;
    };

    const validationInfo = getInfoFromRaw();
    return (
        <div
            style={style}
            className={classNames(defaultSearchClassName, className)}
        >
            {/* <Icon
                className={replaceBtnClassName}
                type={isShowReplace ? 'chevron-down' : 'chevron-right'}
                onClick={onToggleReplaceBtn}
            /> */}
            {/* <Input.Group> */}
                <Input
                    value={searchVal}
                    className={classNames(
                        baseInputClassName,
                        searchTargetContainerClassName
                    )}
                    info={validationInfo}
                    placeholder={searchPlaceholder}
                    onChange={handleSearchChange}
                    toolbarData={searchAddons}
                    onToolbarClick={handleToolbarClick}
                />
            {/* </Input.Group> */}
        </div>
    );
}
