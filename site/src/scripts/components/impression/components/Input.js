import classnames from 'classnames';
import React, { PureComponent, PropTypes } from 'react';
import DatePicker from './DatePicker';
import Upload from './Upload';
import * as System from '../utils/system';

/**
 * Input 组件.
 */
export default class Input extends PureComponent {
    /**
     * 初始化.
     */
    constructor(props, context) {
        super(props, context);
        System.manager(this);

        this.state = {
            showOption: false,
            showClear: false,
        };
    }
    // prop type校验
    static propTypes = {
        // 自定义样式
        className: PropTypes.string,
        // 行内样式
        style: PropTypes.object,
        // 类型
        type: PropTypes.oneOf(['text', 'password', 'file', 'date', 'emaile', 'month', 'search', 'textarea']),
        // 提示
        placeholder: PropTypes.string,
        // 值
        value: PropTypes.any,
        // 默认值
        defaultValue: PropTypes.any,
        // 是否可清除
        clearable: PropTypes.bool,
        // 是否不可选
        disabled: PropTypes.bool,
        // 子元素只能为节点
        children: PropTypes.element,
        // 是否椭圆形
        pill: PropTypes.bool,
        // 点击事件
        onClick: PropTypes.func,
    }
    // 默认props
    static defaultProps = {
        type: 'text',
        clearable: true,
        disabled: false,
    }
    /**
     * 显示候选项.
     */
    showOptionHandle = () => {
        let { disabled } = this.props;

        !disabled && this.setState({
            showOption: true,
            showClear: false,
        });
    }
    /**
     * 隐藏候选项.
     */
    hideOptionsHandle = () => {
        if(!this.refMain) {
            return;
        }

        this.refMain.blur && this.refMain.blur();
        this.setState({
            showOption: false,
            showClear: false,
        });
    }
    /**
     * 清空输入框.
     */
    clearInputHandle = () => {
        let { disabled } = this.props;

        if(disabled) {
            return;
        }

        this.refMain.value = '';
    }
    /**
     * 选中候选项.
     * @param  {[String]} value [候选项值]
     */
    selectOptionsHandle = value => {
        this.refMain.value = value;

        this.setState({
            showOption: false,
            showClear: false,
        });
    }
    /**
     * 显示清空按钮.
     */
    showClearHandle = () => {
        !this.props.disabled
        && this.refMain.value
        && this.setState({
            showClear: true,
        });
    }
    /**
     * 隐藏清空按钮.
     */
    hideClearHandle = () => {
        this.setState({
            showClear: false,
        });
    }
    /**
     * 清空组件管理.
     */
    componentWillUnmount() {
        System.unmanager(this);
    }
    // 渲染
    render() {
        let {
                type,
                value,
                defaultValue,
                disabled,
                placeholder,
                clearable,
                style,
                pill,
                onClick,
                className,
                children,
                ...others,
            } = this.props,
            { showOption, showClear } = this.state,
            pillClass = pill ? 'input-pill' : null;

        children && (children = React.cloneElement(children, {
            className: classnames('input-addon', children.props.className),
        }));

        switch(type) {
            case 'date':
            case 'month':
                return (
                    <div
                        className={classnames('input', className)}
                        ref="container"
                        onMouseEnter={this.showClearHandle}
                        onMouseLeave={this.hideClearHandle}>
                        <input
                            type="text"
                            ref={ref => (this.refMain = ref)}
                            value={value}
                            defaultValue={defaultValue}
                            className={classnames('form-control',
                            pillClass,
                            'input-field',
                            'input-field-addon')}
                            readOnly
                            disabled={disabled}
                            placeholder={placeholder}
                            onClick={this.showOptionHandle}
                            style={style} />

                        { clearable && showClear &&
                            <i className="fa fa-times input-addon" onClick={this.clearInputHandle} />
                        }

                        { (!showClear || !clearable) &&
                            <i className="fa fa-calendar input-addon" onClick={this.showOptionHandle} />
                        }

                        { showOption &&
                            <DatePicker
                                {...others}
                                type={type}
                                value={this.refMain.value}
                                onSelect={this.selectOptionsHandle} />
                        }
                    </div>
                );
            case 'search':
                return (
                    <div
                        className={classnames('input', className)}
                        ref="container">
                        <input
                            {...others}
                            type="text"
                            ref={ref => (this.refMain = ref)}
                            value={value}
                            className={classnames('form-control',
                            pillClass,
                            'input-field',
                            'input-field-addon')}
                            readOnly
                            onClick={onClick}
                            disabled={disabled}
                            placeholder={placeholder}
                            style={style} />
                        { children }
                        { !children &&
                            <i className="fa fa-search input-addon" onClick={onClick} />
                        }
                    </div>
                );
            case 'file':
                return (
                    <Upload
                        {...others}
                        ref={ref => (this.refMain = ref)}
                        className={className}
                        placeholder={placeholder} />
                );
            case 'textarea':
                return (
                    <textarea
                        rows="10"
                        ref={ref => (this.refMain = ref)}
                        style={style}
                        disabled={disabled}
                        placeholder={placeholder}
                        value={value}
                        defaultValue={defaultValue}
                        {...others}
                        className={classnames('form-control', className)} />
                );
            default:
                return (
                    <div
                        className={classnames('input', className)}
                        ref="container">
                        <input
                            {...others}
                            type={type}
                            ref={ref => (this.refMain = ref)}
                            value={value}
                            defaultValue={defaultValue}
                            className={classnames(
                                'form-control',
                                pillClass,
                                'input-field',
                                {
                                    'input-field-addon': children,
                                }
                            )}
                            disabled={disabled}
                            placeholder={placeholder}
                            style={style} />
                        { children }
                    </div>
                );
        }
    }
}

// getValue
Input.getValue = ref => {
    let { type } = ref.props;

    if(!ref) {
        return undefined;
    }

    switch(type) {
        case 'file':
            return ref.refMain.refs.main.files[0];
        default:
            return ref.refMain.value;
    }
};

// setValue
Input.setValue = (ref, value) => {
    let { type } = ref.props;

    if(!ref) {
        return;
    }

    switch(type) {
        case 'file':
            ref.refMain.refs.main.files[0] = value;
            break;
        default:
            ref.refMain.value = value;
    }
};
