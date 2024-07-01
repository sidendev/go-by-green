const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
require("jest-sorted");

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});

describe("404: generic not found error", () => {
  test("404: returns 'not found' when api users endpoint is invalid due to typo or different endpoint received", async () => {
    const response = request(app).get("/api/user");
    expect(404);
    (({ body }) => expect(body.msg).toBe("Not Found"));
  });
});

describe("GET /api/users", () => {
  test("200: return an array of users", async () => {
    const response = await request(app).get("/api/users");
    expect(200);
    (({ body }) => {
      expect(body.users.length).toBeGreaterThan(1);
      const { users } = body;
      users.forEach((user) => {
        expect(user).toMatchObject({
          user_id: expect.any(Number),
          name: expect.any(String),
          username: expect.any(String),
          profile_pic: expect.any(String),
        });
      });
    });
  });
});

describe("GET /api/users/:user_id", () => {
    test("200, returns specific user information", async () => {
        const response = request(app).get("/api/users/1");
        expect(200);
        (({body}) => {
            expect(body.user).toMatchObject({
                user_id: expect.any(Number),
                saved_user_data: expect.any(String),
                username: expect.any(String),
                profile_pic: expect.any(String)
            })
        })
    })
})

describe("GET /api/users", () => {
  test("200: returns an array of objects on the key of topics with following properties: 'slug' and 'description'", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics.length).toBe(3);
        body.topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });

  test("404: returns 'not found' when api topics endpoint is invalid due to typo or different endpoint received", () => {
    return request(app)
      .get("/api/tpics")
      .expect(404)
      .then(({ body }) => expect(body.msg).toBe("Not Found"));
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: return an article object with the correct properties based on the article id", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(String),
        });
      });
  });

  test("404: Not Found when an id is valid but does not exist", () => {
    return request(app)
      .get("/api/articles/500")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not Found");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: return an array of all articles with all the correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });

  test("200: returns articles array sorted by date in descending order ", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at&order=desc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("created_at", {
          coerce: true,
          descending: true,
        });
      });
  });

  test("400: Bad Request when sort by query is not valid", () => {
    return request(app)
      .get("/api/articles?sort_by=cheese&order=desc")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Sort Request");
      });
  });

  test("400: Bad Request when order by query is not valid", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at&order=cheese")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Order Request");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: returns an array of all comments for a given article with the correct properties", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
      });
  });

  test("200: comments should return with the most recent comments first, if article_id has comments", () => {
    return request(app)
      .get("/api/articles/1/comments?sort_by=created_at&order=desc")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeSortedBy("created_at", {
          coerce: true,
          descending: true,
        });
      });
  });

  test("404: if there article id exists but there are no comments", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("This article has no comments");
      });
  });
  test("400: Bad Request when given an invalid id", () => {
    return request(app)
      .get("/api/articles/not-an-id/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: responds with the updated article with positive inc votes", () => {
    return request(app)
      .patch("/api/articles/4")
      .expect(200)
      .send({
        inc_votes: 10,
      })
      .then(({ body }) => {
        const { article } = body;
        expect(article.votes).toBe(10);
        expect(article.article_id).toBe(4);
        expect(article.title).toBe("Student SUES Mitch!");
        expect(article.topic).toBe("mitch");
        expect(article.author).toBe("rogersop");
        expect(article.body).toBe(
          "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages"
        );
        expect(article.created_at).toBe("2020-05-06T01:14:00.000Z");
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });

  test("200: responds with the updated article with negative inc votes", () => {
    return request(app)
      .patch("/api/articles/1")
      .expect(200)
      .send({
        inc_votes: -50,
      })
      .then(({ body }) => {
        const { article } = body;
        expect(article.votes).toBe(50);
        expect(article.article_id).toBe(1);
        expect(article.title).toBe("Living in the shadow of a great man");
        expect(article.topic).toBe("mitch");
        expect(article.author).toBe("butter_bridge");
        expect(article.body).toBe("I find this existence challenging");
        expect(article.created_at).toBe("2020-07-09T20:11:00.000Z");
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });

  test("400: error when invalid article_id is given", () => {
    return request(app)
      .patch("/api/articles/not-valid-id")
      .expect(400)
      .send({
        inc_votes: 10,
      })
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });

  test("404: error when article id is valid but does not exist", () => {
    return request(app)
      .patch("/api/articles/9999")
      .expect(404)
      .send({
        inc_votes: 10,
      })
      .then((response) => {
        expect(response.body.msg).toBe("Article Id does not exist");
      });
  });

  test("400: error when invalid inc_votes body is given", () => {
    return request(app)
      .patch("/api/articles/1")
      .expect(400)
      .send({
        inc_votes: "not_a_number",
      })
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("400: error when inc_votes body is malformed", () => {
    return request(app)
      .patch("/api/articles/1")
      .expect(400)
      .send({})
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: delete a comment given the comment_id resulting in an empty body", () => {
    return request(app).delete("/api/comments/3").expect(204);
  });

  test("404: error message when given a non-existent id", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("comment_id does not exist");
      });
  });
  test("DELETE:400  error message when given an invalid id", () => {
    return request(app)
      .delete("/api/comments/not-a-team")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: sucessfully adds a comment to the given article_id", () => {
    return request(app)
      .post("/api/articles/6/comments")
      .expect(201)
      .send({
        username: "butter_bridge",
        body: "Eius dolor qui ut eligendi. Vero et animi consequatur placeat repudiandae ex dolores qui magni",
      })
      .then(({ body }) => {
        console.log(body, ">>FROM TESTS");
        expect(body.comment.body).toBe(
          "Eius dolor qui ut eligendi. Vero et animi consequatur placeat repudiandae ex dolores qui magni"
        );
        expect(body.comment.author).toBe("butter_bridge");
        expect(body.comment.article_id).toBe(6);
      });
  });

  test("400: responds with a Bad Request when given an invalid-id", () => {
    return request(app)
      .post("/api/articles/invalid-id/comments")
      .expect(400)
      .send({
        username: "cooljmessy",
        body: "Eius dolor qui ut eligendi. Vero et animi consequatur placeat repudiandae ex dolores qui magni",
      })
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });

  test("404: responds with a Not Found when given an non existent article-id", () => {
    return request(app)
      .post("/api/articles/999/comments")
      .expect(404)
      .send({
        username: "cooljmessy",
        body: "Eius dolor qui ut eligendi. Vero et animi consequatur placeat repudiandae ex dolores qui magni",
      })
      .then((response) => {
        expect(response.body.msg).toBe("Article not found");
      });
  });

  test("400: responds with a Bad Request when no comment is sent", () => {
    return request(app)
      .post("/api/articles/5/comments")
      .expect(400)
      .send({
        username: "cooljmessy",
        body: null,
      })
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
});
