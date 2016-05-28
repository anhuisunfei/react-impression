import classnames from 'classnames';
import React, { Component, PropTypes } from 'react';
import FormGroup from './FormGroup';
import FormControl from './FormControl';

/**
 * Form 组件.
 */
export default class Form extends Component{
    //props校验
    static propTypes ={
        //排列方向
        type: PropTypes.string,
        //是否分列
        grid: PropTypes.bool,
        //自定义样式
        className: PropTypes.string,
    }
    //默认props
    static defaultProps = {
        type: 'inline',
        grid: false,
    }
    //渲染
    render(){
        let { type, grid, className, children, ...others } = this.props;
        let typeClass = type? `form-${type}`: null;

        return(
            <form {...others} className={classnames(typeClass, {row: grid}, className)}>
                { children }
            </form>
        );
    }
}

Form.Group = FormGroup;
Form.Control = FormControl;