+++
title = 'Install an IDE'
date = 2024-10-28T20:07:28+08:00
draft = false
weight = 3
+++

To develop LangChain applications, you will need an Integrated Development Environment (IDE). Visual Studio Code (VSCode) is one of the popular choices.

VSCode offers several advantages that make it one of the most recommended IDEs for Python programming:
- It is open-source.
- Lightweight compared to PyCharm.
- Built-in Python support and debugging capabilities.
- Boasts a large community for support.
- Offers numerous extensions that can significantly enhance productivity.

On the other hand, PyCharm is specifically tailored for Python development and provides extensive community support. It has open-source edition too.

Here is a list of installed extensions in VSCode in my environment on Linux, for reference:

```sh
(gpt) [jeff@fedora huggingface]$ code --list-extensions | xargs -L 1 echo code --install-extension
code --install-extension HuggingFace.huggingface-vscode
code --install-extension ms-python.pylint
code --install-extension ms-python.python
code --install-extension ms-python.vscode-pylance
code --install-extension mushan.vscode-paste-image
code --install-extension shd101wyy.markdown-preview-enhanced
code --install-extension streetsidesoftware.code-spell-checker
code --install-extension TabNine.tabnine-vscode
code --install-extension vscodevim.vim
```

extension | function
-- | --
`huggingface-vscode` | LLM powered development for VSCode
`ms-python.pylint` | a static code analyser for Python
`ms-python.python` | enable Python within VSCode
`ms-python.vscode-pylance` | a language server for Python that provides advanced type checking, auto-imports, and code completions
`vscode-paster-image` | copy and paste image within markdown editor
`markdown-preview-enhanced` | one of the most prettiest preview tool for markdown editing
`code-spell-checker` | a spell checker
`tabnine-vscode` | AI coding tool
`vscodevim.vim` | enable `vim` in VSCode

<center>Figure 2.1 VSCode Extension</center>
<br>


You can install the extensions listed in the script above, or you can install them in VSCode GUI.

If you are a fan of `vim`, you can enable Python IDE in `vim` by following the configuration guide at https://realpython.com/vim-and-python-a-match-made-in-heaven/

Enabling a Python IDE in Vim offers the following advantages:
- It provides a stylish and cool appearance, particularly on Unix systems (I am a Linux enthusiast, and Vim is my primary editor in Linux/Unix environments).
- It is robust in displaying documentation on-the-fly as you code without needing a GUI.
- Vim is lightweight and does not consume excessive resources.
- Being open-source, it aligns with the ethos of accessibility and community collaboration.
