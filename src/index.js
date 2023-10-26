const core = require("@actions/core");
const github = require("@actions/github");

async function run() {
    // parse action inputs
    const pGithubToken = core.getInput("token");
    const pOrganization = core.getInput("org");
    const pTeamSlug = core.getInput("team_slug");
    const octokit = github.getOctokit(pGithubToken);

    const query = `query teamWithMembers($login: String!, $slug: String!) {
        organization(login: $login) {
          team(slug: $slug) {
            name
            id
            members {
              nodes {
                id
                login
              }
            }
          }
        }
      }`;

    const queryVariables = {
        login: pOrganization,
        slug: pTeamSlug
    };

    const queryResponse = await octokit.graphql(query, queryVariables);

    if(!!queryResponse) {
        let response = {
            team:{
                id:"",
                name: "",
                members: []    
            }
        }
        core.setOutput("team", response);
    } else {
        core.setFailed("❌ Unable to fetch team");
    }
  
  }
  
  run();