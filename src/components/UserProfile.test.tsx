import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserProfile from './UserProfile';
import fetchMock from 'jest-fetch-mock';

// เปิดใช้งาน fetchMock 
fetchMock.enableMocks();

describe('UserProfile Component', () => {
    //สุม userId 1-10
    const randomUserId = Math.floor(Math.random() * 10) + 1;

    beforeEach(() => {
        //reset fetch
        fetchMock.resetMocks();
    });

    it('should display loading initially', async () => {

        // จำลองการตอบสนองของ delay  แสดง expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
        fetchMock.mockResponseOnce(() => new Promise(resolve => setTimeout(() => resolve({ body: '{}' }), 100)));
        
        // ห่อ `render` ด้วย `act` เพื่อให้สอดคล้องกับการอัปเดต state ของ React อย่างถูกต้อง
        await act(async () => {
            render(<UserProfile userId={randomUserId} />);
        });
        
        //ตรวจสอบข้อมความว่าแสดง Loading... ไหม
        expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    });

    it('should display user data when fetch is successful', async () => {
        // mock data ของผู้ใช้ name, email
        const mockUser = { name: 'John Doe', email: 'john.doe@example.com' };
        fetchMock.mockResponseOnce(JSON.stringify(mockUser));

        // ใช้ `act` ในการ render component UserProfile
        await act(async () => {
            render(<UserProfile userId={randomUserId} />);
        });

        // รอแสดงข้อมูล user
        await waitFor(() => {
            expect(screen.getByText(mockUser.name)).toBeInTheDocument();
            expect(screen.getByText(`Email: ${mockUser.email}`)).toBeInTheDocument();
        });
    });

    it('should display an error message when fetch fails', async () => {
        // mock ข้อความกรณี Failed
        fetchMock.mockRejectOnce(new Error('Failed to fetch user data'));

        // render คอมโพเนนต์โดยห่อด้วย `act`
        await act(async () => {
            render(<UserProfile userId={randomUserId} />);
        });

        // รอแสดงข้อความผิดพลาด
        await waitFor(() => {
            expect(screen.getByText(/Error: Failed to fetch user data/i)).toBeInTheDocument();
        });
    });
});
