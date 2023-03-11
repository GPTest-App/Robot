const core = require('@actions/core');
const github = require('@actions/github');
const { GetUnitTest } = require("./services/GPTestClient");
const { UnitTestIssueBodyTemplate } = require("./utils/IssueBodyTemplate");

const githubApiKey = core.getInput('github_token');
const octokit = github.getOctokit(githubApiKey);

const payload = github.context.payload;
const owner = github.context.repo.owner;
const repo = github.context.repo.repo;


const createUnitTestIssue = async (filePath, unitTest) => {
    const fileExtension = filePath.slice(-1)[0];
    const { data: issue } = await octokit.rest.issues.create({
        owner,
        repo,
        title: `[GPTest} Unit test for ${filePath}`,
        body: UnitTestIssueBodyTemplate(unitTest, filePath, fileExtension)
    });
    return issue;
};

function main(){
    const modifiedFilesPaths = core.getInput('changed_files').split(',');
    try {
        for (let i = 0; i < modifiedFilesPaths.length; i++) {
            github.context.payload.pull_request.number
            octokit.rest.repos.getContent({
                owner,
                repo,
                path: modifiedFilesPaths[i],
                ref: github.context.ref
            }).then((response) => {
                const fileContent = Buffer.from(response.data.content??'', 'base64').toString();
                GetUnitTest(fileContent).then((response) => {
                    createUnitTestIssue(modifiedFilesPaths[i], response.data.unit_test);
                })
                .catch((error) => {
                    console.log("Error: " + error);
                    throw new Error(error);
                });
            });
        }
    } catch (error) {
        core.setFailed(error.message);   
    }
}
main()

