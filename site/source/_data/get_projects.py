import requests
import json

def get_github_repos(username):
    url = f"https://api.github.com/users/{username}/repos"
    response = requests.get(url)
    repos = response.json()
    repos_list = []

    for repo in repos:
        repo_name = repo["name"]
        repo_url = repo["html_url"]
        repo_desc = repo["description"]


        if repo_desc is None:
            repo_desc = "No description"

        repo_data = {
            "name": repo_name,
            "url": repo_url,
            "desc": repo_desc
        }
        repos_list.append(repo_data)

    return repos_list

# Replace 'your-username' with your actual GitHub username
username = 'anthonyrussano'
repos = get_github_repos(username)

output_json = json.dumps(repos, indent=4)

# Write output to a file
with open('projects.json', 'w') as file:
    file.write(output_json)

print("Output saved to repos.json.")
