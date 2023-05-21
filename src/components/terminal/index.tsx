import React, { PureComponent } from "react";
import { editor } from 'monaco-editor';
import { ITerminalService, TerminalService } from "mo/terminal/terminalService";
import { container } from "tsyringe";
import { isEqual } from "lodash";
import { CSSProperties } from "styled-components";
import { APP_PREFIX } from "mo/common/const";

export const SYMBOL_TERMINAL_EDITOR = `${APP_PREFIX}-terminal-editor`;


export interface ITerminalEditorProps extends React.ComponentProps<any> {
  // The option of terminal editor
  options?: editor.IStandaloneEditorConstructionOptions;
  override?: editor.IEditorOverrideServices;
  editorInstanceRef?: (instance: editor.IStandaloneCodeEditor) => void;
  onChangeEditorProps?: (props: ITerminalEditorProps, nextProps: ITerminalEditorProps) => void;
}


export class TerminalEditor extends PureComponent<ITerminalEditorProps> {
  // The instance of terminal
  private terminalInstance!: editor.IStandaloneCodeEditor | undefined;

  // The dom element of terminal container
  private terminalDom!: HTMLDivElement;

  private readonly terminalService: ITerminalService;

  constructor(props) {
    super(props);
    this.terminalService = container.resolve<ITerminalService>(TerminalService);
  }

  componentDidMount(): void {
    const { options = {}, override, editorInstanceRef } = this.props;
    this.terminalInstance = this.terminalService?.create(this.terminalDom, options, override);
    editorInstanceRef?.(this.terminalInstance);
  }

  componentDidUpdate(prevProps: Readonly<ITerminalEditorProps>): void {
    const { onChangeEditorProps } = this.props;
    !isEqual(prevProps, this.props) && onChangeEditorProps?.(prevProps, this.props);
  }

  render() {
    const { style } = this.props;
    let renderStyle: CSSProperties = {
      position: 'relative',
      minHeight: '200px',
      height: '100%',
      width: '100%'
    }

    renderStyle = style ? Object.assign(renderStyle, style) : renderStyle;

    return (
      <div style={renderStyle} className={SYMBOL_TERMINAL_EDITOR} ref={(domIns: HTMLDivElement) => {
        this.terminalDom = domIns;
      }} />
    )
  }
}