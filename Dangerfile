# Ensure there is a summary for a PR
fail "Please provide a summary in the Pull Request description" if github.pr_body.length < 5

# Add a CHANGELOG entry for app changes
if !git.modified_files.include?("CHANGELOG.md")
  warn("Please include a CHANGELOG entry. \nYou can find it at [CHANGELOG.md](https://github.com/artsy/day-schedule-selector/blob/master/CHANGELOG.md).")
end
