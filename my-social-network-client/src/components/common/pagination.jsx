import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";

class Pagination extends Component {
  state = {};
  render() {
    const { itemsCount, pageSize, onPageChange, currentPage } = this.props;
    const pagesCount = Math.ceil(itemsCount / pageSize);

    if (pagesCount === 1) return null;

    const pages = _.range(1, pagesCount + 1);

    return (
      <nav aria-label="Page navigation example">
        <ul className="pagination">
          {pages.map((p) => (
            <li
              key={p}
              className={"page-item " + (p === currentPage ? "active" : "")}
            >
              <a onClick={() => onPageChange(p)} className="page-link">
                {p}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  }
}

Pagination.propTypes = {
  itemsCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
