# Vocabulary API Specification

## Get Words by Unit

Retrieves vocabulary words for a specific unit with pagination support.

### Endpoint

```
GET /getword
```

### Request Parameters

| Parameter | Type   | Required | Description                                    | Default |
|-----------|--------|----------|------------------------------------------------|---------|
| unit      | number | Yes      | Unit number (1-10)                            | -       |
| page      | number | No       | Page number for pagination                     | 1       |
| pageSize  | number | No       | Number of words to return per page (max 50)    | 20      |

### Response

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "total": 150,
    "words": [
      {
        "id": 1,
        "type": "noun",
        "article": "die",
        "word": "Geheimzahl",
        "plural": "-en",
        "meaning": "密码",
        "example": "Du hast sicher die Geheimzahl falsch eingegeben."
      },
      {
        "id": 2,
        "type": "verb",
        "forms": {
          "infinitive": "sperren",
          "present": "er sperrt",
          "perfect": "er hat gesperrt",
          // Future extensible forms:
          // "past": "er sperrte",
          // "subjunctive": "er würde sperren",
          // More tenses and moods can be added here
        },
        "meaning": "冻结",
        "example": "Oh je, meine EC_Karte ist gesperrt!"
      },
      {
        "id": 3,
        "type": "adjective",
        "word": "lautlos",
        "forms": {
          "comparative": "lautloser",  // Optional
          "superlative": "am lautlosesten"  // Optional
        },
        "meaning": "无声的，静音的",
        "example": "Tanja hat ihr Handy auf lautlos gestellt."
      },
      {
        "id": 4,
        "type": "reflexive_verb",
        "forms": {
          "infinitive": "ärgern (sich über etw.)",
          "present": "er ärgert sich über etw.",
          "perfect": "er hat sich über etw. geärgert",
          // Future extensible forms:
          // "past": "er ärgerte sich über etw.",
          // "subjunctive": "er würde sich über etw. ärgern",
          // More tenses and moods can be added here
        },
        "meaning": "(对...)生气，发火",
        "example": "Worüber ärgern Sie sich nicht?"
      }
    ]
  }
}
```

### Response Fields

Common fields for all word types:
| Field           | Type   | Description                                    |
|-----------------|--------|------------------------------------------------|
| code            | number | Response code (0 = success)                    |
| msg             | string | Response message                               |
| data.total      | number | Total number of words in the unit             |
| data.words      | array  | Array of word objects                         |
| data.words[].id | number | Unique identifier for the word                |
| data.words[].type| string | Word type ("noun", "verb", "adjective", "reflexive_verb") |
| data.words[].meaning| string | Chinese meaning                           |
| data.words[].example| string | Example sentence in German                |

Fields specific to nouns (type = "noun"):
| Field    | Type   | Description                     |
|----------|--------|---------------------------------|
| article  | string | Article (der/die/das)           |
| word     | string | The German noun                 |
| plural   | string | Plural form                     |

Fields specific to verbs (type = "verb"):
| Field      | Type   | Description                   |
|------------|--------|-------------------------------|
| forms      | object | Collection of verb forms      |
| forms.infinitive | string | Infinitive form (required) |
| forms.present    | string | Present tense (required)   |
| forms.perfect    | string | Perfect tense (required)   |
| forms.*         | string | Additional forms (optional) |

Fields specific to adjectives (type = "adjective"):
| Field      | Type   | Description                   |
|------------|--------|-------------------------------|
| word       | string | Base form of the adjective    |
| forms      | object | Additional adjective forms    |
| forms.comparative | string | Comparative form (optional) |
| forms.superlative | string | Superlative form (optional) |

Fields specific to reflexive verbs (type = "reflexive_verb"):
| Field      | Type   | Description                                |
|------------|--------|--------------------------------------------|
| forms      | object | Collection of verb forms                   |
| forms.infinitive | string | Infinitive with reflexive (required) |
| forms.present    | string | Present tense with reflexive (required) |
| forms.perfect    | string | Perfect tense with reflexive (required) |
| forms.*         | string | Additional forms (optional)           |

### Error Codes

| Code | Description           |
|------|-----------------------|
| 0    | Success              |
| 1001 | Invalid unit number  |
| 1002 | Invalid page number  |
| 1003 | Invalid page size    |

### Example Request

```
GET /getword?unit=1&page=1&pageSize=20
```

### Notes

1. The unit parameter must be between 1 and 10
2. Page size is limited to 50 words per request to prevent performance issues
3. Words are returned in the order they should be presented to users
4. The `type` field determines the basic structure of each word object
5. All text fields use UTF-8 encoding to support both German and Chinese characters
6. The API is designed to be extensible:
   - Verbs (both regular and reflexive) can add new tenses and moods in the `forms` object
   - Adjectives can optionally include comparative and superlative forms
   - Additional word types or grammatical forms can be added in the future
7. Required vs Optional forms:
   - Nouns: article, word, and plural are always required
   - Verbs: infinitive, present, and perfect are required; other forms are optional
   - Adjectives: base word is required; comparative and superlative are optional
   - Reflexive verbs: infinitive, present, and perfect with reflexive pronouns are required; other forms are optional
