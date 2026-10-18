export const GITHUB_USER_QUERY = `
  query GetUserFacts($login: String!) {
    user(login: $login) {
      name
      login
      bio
      location
      company
      websiteUrl
      avatarUrl
      followers {
        totalCount
      }
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
            name
          }
        }
      }
      repositories(
        first: 30
        ownerAffiliations: OWNER
        isFork: false
        orderBy: { field: STARGAZERS, direction: DESC }
      ) {
        nodes {
          name
          description
          url
          stargazerCount
          pushedAt
          isArchived
          primaryLanguage {
            name
          }
          languages(first: 5, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node {
                name
              }
            }
          }
          repositoryTopics(first: 5) {
            nodes {
              topic {
                name
              }
            }
          }
        }
      }
      contributionsCollection {
        totalCommitContributions
        totalPullRequestContributions
      }
    }
  }
`;
