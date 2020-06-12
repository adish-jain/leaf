import React, { Component } from "react";
import { Controlled as CodeMirror2 } from "react-codemirror2";

type CodeMirrorProps = {};

type CodeMirrorState = {
  value: string;
  ranges: {
    anchor: {
      ch: number;
      line: number;
    };
    head: {
      ch: number;
      line: number;
    };
  }[];
};

export default class CodeMirror extends Component<
  CodeMirrorProps,
  CodeMirrorState
> {
  instance: any;

  constructor(props: CodeMirrorProps) {
    super(props);

    this.instance = null;

    this.state = {
      value: `testing
ewafwadawd
eadawdawd
awdawdwawdawdaw
adwawdaw
wadawdfawfaefafwafa
                `,
      ranges: [
        {
          anchor: { ch: 1, line: 0 },
          head: { ch: 5, line: 0 },
        },
        {
          anchor: { ch: 1, line: 1 },
          head: { ch: 5, line: 1 },
        },
      ],
    };
  }
  render() {
    return (
      <div>
        <CodeMirror2
          value={this.state.value}
          options={{
            lineNumbers: true,
            // configureMouse: {
            //   addNew: false,
            // },
            configureMouse: (editor: any, e: any) => {
                return {
                    addNew: true
                }
            }
          }}
          editorDidMount={(editor) => {
            this.instance = editor;
            console.log(editor);
          }}
          onBeforeChange={(editor: any, data: any, value: string) => {
            console.log("onbeforechange");

            this.setState({ value });
          }}
          onChange={(editor: any, data: any, value: string) => {}}
          selection={{
            ranges: this.state.ranges,
            focus: true, // defaults false if not specified
          }}
          onSelection={(editor, data) => {
            // console.log(data);
          }}
        />
      </div>
    );
  }
}
