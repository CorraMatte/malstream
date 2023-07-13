import React, {useEffect} from "react";
import Editor, {useMonaco} from "@monaco-editor/react";
import YARA from "./language/YARA";
import PropTypes from "prop-types";
import MonacoSigmaEditor from "./MonacoSigmaEditor";


const MonacoYaraEditor = ({readOnly, ...props}) => {
  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      /**
       * Monaco editor initialization
       * Taken by mquery https://github.com/CERT-Polska/mquery/blob/master/src/mqueryfront/src/query/QueryMonaco.js
       */

        // Register a new yara language
        monaco.languages.register({ id: "yara" });

        // Register a tokens provider for yara
        monaco.languages.setMonarchTokensProvider("yara", YARA.TOKEN_PROVIDER);

        // Register a completion item provider for yara
        monaco.languages.registerCompletionItemProvider("yara", {
          provideCompletionItems: () => {
            var suggestions = [
              {
                label: "rule",
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: YARA.COMPLETION_RULE,
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: "Generate a rule skeleton",
              },
            ];
            return { suggestions: suggestions };
          },
        });
    }
  }, [monaco]);

  return (
    <Editor
      height="45vh"
      defaultValue=""
      language="yara"
      theme={"vs-dark"}
      options={{
        minimap : {
          enabled: false
        },
        readOnly: readOnly
      }}
      {...props}
    />
  );
}


MonacoYaraEditor.propTypes = {
  readOnly: PropTypes.bool.isRequired
}


export default MonacoYaraEditor;
