import { render, fireEvent } from '@testing-library/react';
import { ColumnHeader } from './ColumnHeader';
import { TableOrder } from './Table.props';

describe('ColumnHeader', () => {
    const setColumnSort = jest.fn();

    const ColumnHeaderTest = () => (
        <table>
            <thead>
                <tr>
                    <ColumnHeader index={0} header="Name" setColumnSort={setColumnSort} />
                </tr>
            </thead>
        </table>
    );

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render the header text', () => {
        const { getByText } = render(<ColumnHeaderTest />);
        expect(getByText('Name')).toBeInTheDocument();
    });

    it('should call setColumnSort when the header is clicked', () => {
        const { getByTestId } = render(<ColumnHeaderTest />);
        fireEvent.click(getByTestId('column-header-0'));
        expect(setColumnSort).toHaveBeenCalledWith({
            order: 'asc',
            column: 'Name',
        });
    });

    it('should toggle the sort order when the sorted header is clicked', () => {
        const { getByTestId } = render(
            <table>
                <thead>
                    <tr>
                        <ColumnHeader
                            index={0}
                            header="Name"
                            setColumnSort={setColumnSort}
                            columnSort={{ order: TableOrder.ASC, column: 'Name' }}
                        />
                    </tr>
                </thead>
            </table>);
        fireEvent.click(getByTestId('column-header-0'));
        expect(setColumnSort).toHaveBeenCalledWith({
            order: TableOrder.DESC,
            column: 'Name',
        });
        fireEvent.click(getByTestId('column-header-0'));
        expect(setColumnSort).toHaveBeenCalledWith({
            order: TableOrder.ASC,
            column: 'Name',
        });
    });

    it('should sort in ascending order when an unsorted header is clicked', () => {
        const { getByTestId } = render(<ColumnHeaderTest />);
        fireEvent.click(getByTestId('column-header-0'));
        expect(setColumnSort).toHaveBeenCalledWith({
            order: 'asc',
            column: 'Name',
        });
    });

    it('should display the sort icon when the header is hovered over', () => {
        const { getByTestId } = render(<ColumnHeaderTest />);
        fireEvent.mouseEnter(getByTestId('column-header-0'));
        expect(getByTestId('sort-icon')).toBeInTheDocument();
    });
});