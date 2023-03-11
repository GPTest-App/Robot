function UnitTestIssueBodyTemplate(unitTest, filePath, language = "js") {
    return `## Ta-da! Here's the unit test for ${filePath} 
    
    \`\`\`${language}
    ${unitTest}
    \`\`\``;
}

module.exports = { UnitTestIssueBodyTemplate };