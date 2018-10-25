export const getSortQuery = (pagination, sort) => {
  let result = {}
  if(pagination) {
    pagination = JSON.parse(pagination)
    queryInterval = {
      skip: (pagination.page - 1) * pagination.perPage,
      limit: parseInt(pagination.perPage),
    }
    result = Object.assign(result, queryInterval)
  }

  if(sort) {
    sort = JSON.parse(sort)

    let queryOrder = {}
    queryOrder[sort.field] = 1
    if (sort.order === 'DESC') {
      queryOrder[sort.field] = -1
    }
    if (queryOrder.id) {
      queryOrder._id = queryOrder.id
      delete queryOrder.id
    }
    result = Object.assign(result, {sort: queryOrder})
  }

  return result
}
