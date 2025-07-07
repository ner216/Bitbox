# Basic Git Usage for Bitbox
### Cloning the repo:
*Use the develop branch!*
Clone the repo with `git clone <url>`.

### Using git branch:
**Options:**

- `-d` Delete
- `-r` list remote branches
- `-l` list branches
- `-u` set upstream (GitHub remote)

**Create new branch and switch to it:**
-  Use `git checkout -b [branch_name]`

### Switching branches:
Use the command `git checkout` to switch between branches. Using `git branch` with no arguments will display a list of branches with the active branch highlighted.

### Create a branch for development:
For each of your tasks. You will want to first switch to the `develop` branch of our repo. Then, you will create a branch off of the development branch for your feature/task. Name your branch using the following convention: `<type>/<name>-<short-description>`
*The type field will match the commit type.*

*Examples:*
> - feature/john-login-page
> - bugfix/bill-playlist-create-error
> - build/joe-web-build

### Commit message format:
When creating the commit messages for the command `git commit -m [message]`, Use these guidlines:
Format of message: `<type>(optional scope): <short description>`

**Types:**
- `feat` -- A new feature
- `fix` -- A bug fix
- `docs` -- Documentation
- `style` -- Code style changes such as formatting
- `refactor` -- Code change that does not add a feature or fix a bug
- `perf` -- Performance improvements
- `test` -- Adding or modifying tests
- `build` -- Build system (Docker, npm, etc)
- `chore` -- Routine tasks
- `revert` -- reverts a previous commit

**Examples:**
- A new playlist shuffle feature:
    - `feat(shuffle): Add music playlist shuffle functionality.`
- Fix profile web-page text spacing:
    - `fix(ui): Correct spacing on profile page.` 

### How often should I commit?
Make commits frequently. Once you have a working code base that would "make a good backup point", commit your changes. Do not commit partial changes. Commits should be phrased in the future tense. Meaning, If your commit contains a new feature, you would **say: `"Add [new-feature-description]"`**, 

*not this phrase: `"Added [new-feature-description]"`*.

### Set up your Git install for cross-platform(IMPORTANT):
- On Windows: `git config --global core.autocrlf true`
- On Linux/Mac: `git config --global core.autocrlf input`

**Create your branch:**
When you clone the repo with the link, you will always be placed on the main branch on your local system. So, after cloning, run `git checkout develop` to switch to the develop branch.

Now, for your task, create a new branch with: 
`git checkout -b <type>/<name>-<desc>`

After commits and progress is made--when you are ready to push your branch to develop branch:
`git push --set-upstream origin <your_branch_name>`

**On GitHub:**
The last step of the process is to create a pull request on GitHub. Make sure that your merge has a base of "develop" and **not** a base of "main".