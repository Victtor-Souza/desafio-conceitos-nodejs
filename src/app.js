const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes:0
  }

  repositories.push(repository)
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;

  if (!isUuid(id)) {
    return response.status(400).json({error: "Id is not a uuid"})
  }
  const repoIndex = repositories.findIndex(repository => repository.id === id);

  if (repoIndex < 0) {
    return response.status(404).json({error: "Repository not found"})
  }
  const oldLikes = repositories[repoIndex].likes;

  const repository = {
    id,
    title, 
    url,
    techs,
    likes: oldLikes
  }

  repositories[repoIndex] = repository

  return response.json(repository);
  
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({error: "Id is not a uuid"})
  }

  const repoIndex = repositories.findIndex(repository => repository.id === id);

  if (repoIndex < 0){
    return response.status(404).json({error: "Repository not found"})
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  if (!isUuid(id)){
    return response.status(400).json({error: "Id is not a uuid"})
  }

  const repoIndex = repositories.findIndex(repository => repository.id === id);

  if (repoIndex < 0){
    return response.status(404).json({error: "Repository not found"});
  }
  let repository = repositories[repoIndex]

  repository.likes += 1;

   return response.json(repository)
});

module.exports = app;
