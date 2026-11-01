import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import Pagination from '../index';

expect.extend(toHaveNoViolations);

function Fixture({ total = 50, loading = false }: { total?: number; loading?: boolean }) {
  const [pageSize, setPageSize] = React.useState(10);
  const [currentPage, setCurrentPage] = React.useState(1);
  return <>
    <Pagination pageSizeArray={[5, 10, 25]} totalResultsNumber={total}
      pageSize={pageSize} setPageSize={setPageSize}
      currentPage={currentPage} setCurrentPage={setCurrentPage} isLoading={loading} />
    <output data-testid="state">{currentPage}:{pageSize}</output>
  </>;
}

describe('Pagination', () => {
  it('exposes an accessible navigation landmark and native controls', () => {
    render(<Fixture />);
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Results per page' })).toHaveValue('10');
    expect(screen.getByRole('combobox', { name: 'Current page' })).toHaveValue('1');
    expect(screen.getByRole('button', { name: 'Go to first page' })).toBeDisabled();
  });

  it('navigates using buttons and clamps at the final page', async () => {
    const user = userEvent.setup(); render(<Fixture total={25} />);
    await user.click(screen.getByRole('button', { name: 'Go to page 2' }));
    expect(screen.getByTestId('state')).toHaveTextContent('2:10');
    await user.click(screen.getByRole('button', { name: 'Go to last page' }));
    expect(screen.getByTestId('state')).toHaveTextContent('3:10');
    expect(screen.getByRole('button', { name: 'Go to page 3' })).toBeDisabled();
  });

  it('resets the page to one when the page size changes', async () => {
    const user = userEvent.setup(); render(<Fixture />);
    await user.selectOptions(screen.getByRole('combobox', { name: 'Current page' }), '3');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Results per page' }), '25');
    expect(screen.getByTestId('state')).toHaveTextContent('1:25');
  });

  it('disables navigation while loading', () => {
    render(<Fixture loading />);
    expect(screen.getByRole('combobox', { name: 'Results per page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Go to last page' })).toBeDisabled();
  });

  it('handles zero results', () => {
    render(<Fixture total={0} />);
    expect(screen.getByRole('combobox', { name: 'Current page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Go to last page' })).toBeDisabled();
    expect(screen.getByText('of 1')).toBeInTheDocument();
  });

  it('allows keyboard navigation through native selects', async () => {
    const user = userEvent.setup(); render(<Fixture />);
    await user.tab();
    expect(screen.getByRole('combobox', { name: 'Results per page' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('combobox', { name: 'Current page' })).toHaveFocus();
  });

  it('has no automatically detectable axe violations', async () => {
    const { container } = render(<Fixture />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
